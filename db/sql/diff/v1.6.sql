
-- ADD COMMUNICATION TABLE

CREATE TABLE Communication (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	addresses TEXT,
	subject VARCHAR(255) NOT NULL,
	body TEXT NOT NULL,
	status enum('DRAFT', 'PROCESSED') NOT NULL DEFAULT 'DRAFT',
	sys_date timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

-- [OPTIONAL] ADD is_targeting_sme TAXONOMY VALUES TO COMPANIES

INSERT INTO TaxonomyAssignment
SELECT c.id, tv.id
FROM Company c
LEFT JOIN TaxonomyValue tv
    ON tv.`name` = "SMALL ENTERPRISE - 10 TO 49"
    AND tv.category = "ENTITY TARGET"
WHERE is_targeting_sme = true
AND (
    SELECT COUNT(*)
    FROM TaxonomyAssignment ta
    WHERE ta.company = c.id
    AND ta.taxonomy_value = tv.id
    ) = 0;

INSERT INTO TaxonomyAssignment
SELECT c.id, tv.id
FROM Company c
LEFT JOIN TaxonomyValue tv
	ON tv.`name` = "MICRO-ENTERPRISE - LESS THAN 10"
    AND tv.category = "ENTITY TARGET"
WHERE is_targeting_sme = true
AND (
    SELECT COUNT(*)
    FROM TaxonomyAssignment ta
    WHERE ta.company = c.id
    AND ta.taxonomy_value = tv.id
    ) = 0;

-- Remove is_targeting_sme column

ALTER TABLE Company
DROP COLUMN is_targeting_sme;
