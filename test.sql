/* add race 
SELECT * FROM Race WHERE raceId = 'race99';

SELECT rr.*, h.horseName 
FROM RaceResults rr 
JOIN Horse h ON rr.horseId = h.horseId 
WHERE rr.raceId = 'race99'
ORDER BY 
    CASE rr.results
        WHEN 'first' THEN 1
        WHEN 'second' THEN 2
        WHEN 'third' THEN 3
    END;
*/

/* remove owner
SELECT * FROM Owner WHERE ownerId = 'owner12';
*/

/* transfer horse to another stable
SELECT h.*, s.stableName, s.location, s.colors
FROM Horse h
JOIN Stable s ON h.stableId = s.stableId
WHERE h.horseId = 'horse1';
*/

/* add trainer
SELECT t.*, s.stableName, s.location
FROM Trainer t
JOIN Stable s ON t.stableId = s.stableId
WHERE t.trainerId = 'trainer99';
*/