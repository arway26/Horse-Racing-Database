
USE racing_db;

-- ============================================================
-- TABLE: old_info
-- Purpose: Archive deleted horse information
-- ============================================================

DROP TABLE IF EXISTS old_info;

CREATE TABLE old_info (
    archiveId INT AUTO_INCREMENT,
    horseId VARCHAR(15) NOT NULL,
    horseName VARCHAR(15) NOT NULL,
    age INT,
    gender CHAR,
    registration INTEGER NOT NULL,
    stableId VARCHAR(30) NOT NULL,
    deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (archiveId),
    INDEX idx_horseId (horseId),
    INDEX idx_deletedAt (deletedAt)
) ENGINE=InnoDB;

-- ============================================================
-- STORED PROCEDURE: DeleteOwnerAndRelatedInfo
-- Purpose: Delete an owner and all related ownership records
-- Parameters: p_ownerId - The owner ID to delete
-- Returns: Status, Message, and counts of deleted records
-- ============================================================

DROP PROCEDURE IF EXISTS DeleteOwnerAndRelatedInfo;

DELIMITER $$

CREATE PROCEDURE DeleteOwnerAndRelatedInfo(
    IN p_ownerId VARCHAR(15)
)
BEGIN
    -- Variable declarations
    DECLARE v_owner_exists INT DEFAULT 0;
    DECLARE v_owns_count INT DEFAULT 0;
    DECLARE v_owner_fname VARCHAR(15);
    DECLARE v_owner_lname VARCHAR(15);
    
    -- Error handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error' AS Status, 
               'An error occurred while deleting owner. Transaction rolled back.' AS ErrorMessage,
               0 AS OwnsDeleted,
               0 AS OwnerDeleted;
    END;
    
    -- Start transaction
    START TRANSACTION;
    
    -- Check if owner exists and get details
    SELECT COUNT(*), 
           MAX(fname), 
           MAX(lname) 
    INTO v_owner_exists, v_owner_fname, v_owner_lname
    FROM Owner
    WHERE ownerId = p_ownerId;
    
    -- If owner doesn't exist, return error
    IF v_owner_exists = 0 THEN
        SELECT 'Error' AS Status,
               CONCAT('Owner ID "', p_ownerId, '" not found in database') AS ErrorMessage,
               0 AS OwnsDeleted,
               0 AS OwnerDeleted;
        ROLLBACK;
    ELSE
        -- Count ownership records before deletion
        SELECT COUNT(*) INTO v_owns_count
        FROM Owns
        WHERE ownerId = p_ownerId;
        
        -- Delete all ownership records for this owner
        DELETE FROM Owns WHERE ownerId = p_ownerId;
        
        -- Delete the owner record
        DELETE FROM Owner WHERE ownerId = p_ownerId;
        
        -- Commit the transaction
        COMMIT;
        
        -- Return success message with details
        SELECT 'Success' AS Status,
               CONCAT('Owner "', p_ownerId, '" (', 
                      IFNULL(v_owner_fname, ''), ' ', 
                      IFNULL(v_owner_lname, ''), 
                      ') deleted successfully') AS Message,
               v_owns_count AS OwnsDeleted,
               1 AS OwnerDeleted;
    END IF;
END$$

DELIMITER ;

-- ============================================================
-- STORED PROCEDURE: MoveHorseToStable
-- Purpose: Transfer a horse from one stable to another
-- Parameters: 
--   p_horseId - The horse ID to move
--   p_newStableId - The destination stable ID
-- Returns: Status, Message, and stable IDs
-- ============================================================

DROP PROCEDURE IF EXISTS MoveHorseToStable;

DELIMITER $$

CREATE PROCEDURE MoveHorseToStable(
    IN p_horseId VARCHAR(15),
    IN p_newStableId VARCHAR(15)
)
BEGIN
    -- Variable declarations
    DECLARE v_horse_exists INT DEFAULT 0;
    DECLARE v_stable_exists INT DEFAULT 0;
    DECLARE v_old_stableId VARCHAR(15);
    DECLARE v_horseName VARCHAR(15);
    DECLARE v_old_stableName VARCHAR(30);
    DECLARE v_new_stableName VARCHAR(30);
    
    -- Error handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error' AS Status,
               'An error occurred while moving horse. Transaction rolled back.' AS ErrorMessage,
               NULL AS OldStableId,
               NULL AS NewStableId;
    END;
    
    -- Start transaction
    START TRANSACTION;
    
    -- Check if horse exists and get current stable
    SELECT COUNT(*), 
           MAX(stableId),
           MAX(horseName)
    INTO v_horse_exists, v_old_stableId, v_horseName
    FROM Horse
    WHERE horseId = p_horseId;
    
    -- Check if new stable exists
    SELECT COUNT(*), MAX(stableName)
    INTO v_stable_exists, v_new_stableName
    FROM Stable
    WHERE stableId = p_newStableId;
    
    -- Get old stable name
    IF v_old_stableId IS NOT NULL THEN
        SELECT stableName INTO v_old_stableName
        FROM Stable
        WHERE stableId = v_old_stableId;
    END IF;
    
    -- Validation checks
    IF v_horse_exists = 0 THEN
        SELECT 'Error' AS Status,
               CONCAT('Horse ID "', p_horseId, '" not found in database') AS ErrorMessage,
               NULL AS OldStableId,
               NULL AS NewStableId;
        ROLLBACK;
        
    ELSEIF v_stable_exists = 0 THEN
        SELECT 'Error' AS Status,
               CONCAT('Stable ID "', p_newStableId, '" not found in database') AS ErrorMessage,
               v_old_stableId AS OldStableId,
               NULL AS NewStableId;
        ROLLBACK;
        
    ELSEIF v_old_stableId = p_newStableId THEN
        SELECT 'Error' AS Status,
               CONCAT('Horse "', v_horseName, '" is already in stable "', v_new_stableName, '"') AS ErrorMessage,
               v_old_stableId AS OldStableId,
               p_newStableId AS NewStableId;
        ROLLBACK;
        
    ELSE
        -- Update horse's stable
        UPDATE Horse
        SET stableId = p_newStableId
        WHERE horseId = p_horseId;
        
        -- Commit the transaction
        COMMIT;
        
        -- Return success message with details
        SELECT 'Success' AS Status,
               CONCAT('Horse "', v_horseName, '" (', p_horseId, ') moved from "',
                      v_old_stableName, '" to "', v_new_stableName, '"') AS Message,
               v_old_stableId AS OldStableId,
               p_newStableId AS NewStableId,
               v_horseName AS HorseName,
               v_old_stableName AS OldStableName,
               v_new_stableName AS NewStableName;
    END IF;
END$$

DELIMITER ;

-- ============================================================
-- TRIGGER: before_horse_delete (CORRECTED - Fixed table name)
-- Purpose: Automatically archive horse information before deletion
-- Fires: BEFORE DELETE on Horse table
-- Action: Copies all horse data to old_info table with timestamp
-- ============================================================

DROP TRIGGER IF EXISTS before_horse_delete;

DELIMITER $$

CREATE TRIGGER before_horse_delete
BEFORE DELETE ON Horse
FOR EACH ROW
BEGIN
    -- Insert the horse's complete information into archive table
    INSERT INTO old_info (
        horseId, 
        horseName, 
        age, 
        gender, 
        registration, 
        stableId, 
        deletedAt
    )
    VALUES (
        OLD.horseId, 
        OLD.horseName, 
        OLD.age, 
        OLD.gender, 
        OLD.registration, 
        OLD.stableId, 
        NOW()
    );
END$$

DELIMITER ;