-- SQL schema for normalized project data

CREATE TABLE Country (
    CountryID INTEGER PRIMARY KEY AUTOINCREMENT,
    CountryName TEXT UNIQUE NOT NULL
);

CREATE TABLE Theme (
    ThemeID INTEGER PRIMARY KEY AUTOINCREMENT,
    ThemeName TEXT UNIQUE NOT NULL
);

CREATE TABLE Donor (
    DonorID INTEGER PRIMARY KEY AUTOINCREMENT,
    DonorName TEXT UNIQUE
);

CREATE TABLE Project (
    ProjectID INTEGER PRIMARY KEY,
    ProjectTitle TEXT NOT NULL,
    PAASCode TEXT,
    ApprovalStatus TEXT,
    Fund TEXT,
    PAGValue REAL,
    StartDate DATE,
    EndDate DATE,
    LeadOrgUnit TEXT,
    TotalExpenditure REAL,
    TotalContribution REAL,
    TotalContributionMinusExpenditure REAL,
    TotalPSC REAL
);

CREATE TABLE ProjectCountry (
    ProjectID INTEGER,
    CountryID INTEGER,
    PRIMARY KEY (ProjectID, CountryID),
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
    FOREIGN KEY (CountryID) REFERENCES Country(CountryID)
);

CREATE TABLE ProjectTheme (
    ProjectID INTEGER,
    ThemeID INTEGER,
    PRIMARY KEY (ProjectID, ThemeID),
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
    FOREIGN KEY (ThemeID) REFERENCES Theme(ThemeID)
);

CREATE TABLE ProjectDonor (
    ProjectID INTEGER,
    DonorID INTEGER,
    PRIMARY KEY (ProjectID, DonorID),
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
    FOREIGN KEY (DonorID) REFERENCES Donor(DonorID)
);
