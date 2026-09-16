import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    displayName: text("display_name").notNull(),
    setupCompleted: boolean("setup_completed").notNull().default(false),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    emailUnique: uniqueIndex("users_email_unique").on(t.email),
  }),
)

export const authSessions = pgTable(
  "auth_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    revokedAt: timestamp("revoked_at"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    tokenHashUnique: uniqueIndex("auth_sessions_token_hash_unique").on(t.tokenHash),
    userIdIndex: index("auth_sessions_user_id_index").on(t.userId),
    expiresAtIndex: index("auth_sessions_expires_at_index").on(t.expiresAt),
  }),
)

export const settings = pgTable(
  "settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    value: jsonb("value").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userKeyUnique: uniqueIndex("settings_user_key_unique").on(t.userId, t.key),
  }),
)

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id"),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("audit_logs_user_id_index").on(t.userId),
    createdAtIndex: index("audit_logs_created_at_index").on(t.createdAt),
    entityTypeIndex: index("audit_logs_entity_type_index").on(t.entityType),
  }),
)

export const sourceCitations = pgTable(
  "source_citations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sourceType: text("source_type").notNull(),
    url: text("url"),
    retrievedAt: timestamp("retrieved_at").defaultNow().notNull(),
    claim: text("claim").notNull(),
    relatedEntityType: text("related_entity_type").notNull(),
    relatedEntityId: uuid("related_entity_id"),
    verificationStatus: text("verification_status").notNull().default("UNKNOWN"),
  },
  (t) => ({
    userIdIndex: index("source_citations_user_id_index").on(t.userId),
    relatedEntityIndex: index("source_citations_related_entity_index").on(t.relatedEntityType, t.relatedEntityId),
    retrievedAtIndex: index("source_citations_retrieved_at_index").on(t.retrievedAt),
  }),
)

export const careerProfiles = pgTable(
  "career_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fullName: text("full_name"),
    headline: text("headline"),
    location: text("location"),
    workMode: text("work_mode"),
    salaryExpectations: jsonb("salary_expectations").default({}),
    careerGoals: jsonb("career_goals").default({}),
    preferredRoles: jsonb("preferred_roles").default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userUnique: uniqueIndex("career_profiles_user_unique").on(t.userId),
  }),
)

export const careerDna = pgTable(
  "career_dna",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    careerIdentity: text("career_identity"),
    coreStrengths: jsonb("core_strengths").default([]),
    technicalStrengths: jsonb("technical_strengths").default([]),
    domainStrengths: jsonb("domain_strengths").default([]),
    transferableSkills: jsonb("transferable_skills").default([]),
    evidenceBackedAchievements: jsonb("evidence_backed_achievements").default([]),
    careerThemes: jsonb("career_themes").default([]),
    roleFamilies: jsonb("role_families").default([]),
    potentialRoleTransitions: jsonb("potential_role_transitions").default([]),
    skillGaps: jsonb("skill_gaps").default([]),
    experienceGaps: jsonb("experience_gaps").default([]),
    positioningOptions: jsonb("positioning_options").default([]),
    sourceContext: jsonb("source_context").default({}),
    generatedAt: timestamp("generated_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userUnique: uniqueIndex("career_dna_user_unique").on(t.userId),
  }),
)

export const careerEvidence = pgTable(
  "career_evidence",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    claim: text("claim").notNull(),
    source: text("source"),
    sourceType: text("source_type").notNull(),
    date: timestamp("date"),
    confidence: numeric("confidence", { precision: 5, scale: 4 }).default("0.0000"),
    verificationStatus: text("verification_status").notNull().default("UNKNOWN"),
    relatedRole: text("related_role"),
    relatedSkill: text("related_skill"),
    relatedAchievement: text("related_achievement"),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("career_evidence_user_id_index").on(t.userId),
    verificationStatusIndex: index("career_evidence_verification_status_index").on(t.verificationStatus),
    relatedRoleIndex: index("career_evidence_related_role_index").on(t.relatedRole),
  }),
)

export const achievements = pgTable(
  "achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    metrics: jsonb("metrics").default({}),
    evidenceId: uuid("evidence_id").references(() => careerEvidence.id, { onDelete: "set null" }),
    verificationStatus: text("verification_status").notNull().default("UNKNOWN"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("achievements_user_id_index").on(t.userId),
    evidenceIdIndex: index("achievements_evidence_id_index").on(t.evidenceId),
  }),
)

export const carStories = pgTable(
  "car_stories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    challenge: text("challenge").notNull(),
    action: text("action").notNull(),
    result: text("result").notNull(),
    metrics: jsonb("metrics").default({}),
    skills: text("skills").array().default([]),
    tools: text("tools").array().default([]),
    role: text("role"),
    companyContext: text("company_context"),
    evidenceId: uuid("evidence_id").references(() => careerEvidence.id, { onDelete: "set null" }),
    verificationStatus: text("verification_status").notNull().default("UNKNOWN"),
    source: text("source"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("car_stories_user_id_index").on(t.userId),
    evidenceIdIndex: index("car_stories_evidence_id_index").on(t.evidenceId),
  }),
)

export const skills = pgTable(
  "skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: text("category").notNull().default("general"),
    proficiency: text("proficiency"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("skills_user_id_index").on(t.userId),
    nameIndex: index("skills_name_index").on(t.name),
  }),
)

export const skillEvidence = pgTable(
  "skill_evidence",
  {
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    evidenceId: uuid("evidence_id")
      .notNull()
      .references(() => careerEvidence.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey(t.skillId, t.evidenceId),
    evidenceIdIndex: index("skill_evidence_evidence_id_index").on(t.evidenceId),
  }),
)

export const certifications = pgTable(
  "certifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    issuingOrganization: text("issuing_organization"),
    issuedDate: timestamp("issued_date"),
    expirationDate: timestamp("expiration_date"),
    credentialUrl: text("credential_url"),
    verificationStatus: text("verification_status").notNull().default("UNKNOWN"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("certifications_user_id_index").on(t.userId),
  }),
)

export const education = pgTable(
  "education",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    institution: text("institution").notNull(),
    degree: text("degree"),
    fieldOfStudy: text("field_of_study"),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    description: text("description"),
    verificationStatus: text("verification_status").notNull().default("UNKNOWN"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("education_user_id_index").on(t.userId),
  }),
)

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    outcome: text("outcome"),
    role: text("role"),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    evidenceId: uuid("evidence_id").references(() => careerEvidence.id, { onDelete: "set null" }),
    verificationStatus: text("verification_status").notNull().default("UNKNOWN"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("projects_user_id_index").on(t.userId),
    evidenceIdIndex: index("projects_evidence_id_index").on(t.evidenceId),
  }),
)

export const workExperience = pgTable(
  "work_experience",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    company: text("company").notNull(),
    title: text("title").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    current: boolean("current").notNull().default(false),
    location: text("location"),
    description: text("description"),
    achievementsJson: jsonb("achievements_json").default([]),
    verificationStatus: text("verification_status").notNull().default("UNKNOWN"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("work_experience_user_id_index").on(t.userId),
    companyIndex: index("work_experience_company_index").on(t.company),
  }),
)

export const masterResumes = pgTable(
  "master_resumes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull().default("Master Resume"),
    isMaster: boolean("is_master").notNull().default(true),
    content: jsonb("content").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("master_resumes_user_id_index").on(t.userId),
  }),
)

export const resumeVersions = pgTable(
  "resume_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    masterResumeId: uuid("master_resume_id")
      .notNull()
      .references(() => masterResumes.id, { onDelete: "cascade" }),
    versionNumber: integer("version_number").notNull(),
    template: text("template").notNull().default("standard"),
    content: jsonb("content").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    masterVersionUnique: uniqueIndex("resume_versions_master_version_unique").on(t.masterResumeId, t.versionNumber),
  }),
)

export const tailoredResumes = pgTable(
  "tailored_resumes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: uuid("job_id"),
    masterResumeId: uuid("master_resume_id")
      .notNull()
      .references(() => masterResumes.id, { onDelete: "cascade" }),
    resumeVersionId: uuid("resume_version_id").references(() => resumeVersions.id, { onDelete: "set null" }),
    format: text("format").notNull().default("standard"),
    content: jsonb("content").notNull().default({}),
    changes: jsonb("changes").default({}),
    addedKeywords: jsonb("added_keywords").default([]),
    removedContent: jsonb("removed_content").default([]),
    evidenceUsed: jsonb("evidence_used").default([]),
    potentialRisks: jsonb("potential_risks").default([]),
    versionNumber: integer("version_number").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("tailored_resumes_user_id_index").on(t.userId),
    jobIdIndex: index("tailored_resumes_job_id_index").on(t.jobId),
    masterResumeIdIndex: index("tailored_resumes_master_resume_id_index").on(t.masterResumeId),
  }),
)

export const resumeSections = pgTable(
  "resume_sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    resumeVersionId: uuid("resume_version_id")
      .notNull()
      .references(() => resumeVersions.id, { onDelete: "cascade" }),
    sectionType: text("section_type").notNull(),
    content: jsonb("content").notNull().default({}),
    orderIndex: integer("order_index").notNull().default(0),
    evidenceIds: jsonb("evidence_ids").default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    resumeOrderUnique: uniqueIndex("resume_sections_resume_order_unique").on(t.resumeVersionId, t.orderIndex),
  }),
)

export const roleFamilies = pgTable(
  "role_families",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("role_families_user_id_index").on(t.userId),
    nameIndex: index("role_families_name_index").on(t.name),
  }),
)

export const jobRoles = pgTable(
  "job_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleFamilyId: uuid("role_family_id").references(() => roleFamilies.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    seniority: text("seniority"),
    description: text("description"),
    skills: jsonb("skills").default([]),
    tools: jsonb("tools").default([]),
    domains: jsonb("domains").default([]),
    responsibilities: jsonb("responsibilities").default([]),
    commonKeywords: jsonb("common_keywords").default([]),
    transferableSkills: jsonb("transferable_skills").default([]),
    experienceRequirements: jsonb("experience_requirements").default({}),
    careerTransitions: jsonb("career_transitions").default([]),
    targetCompanies: jsonb("target_companies").default([]),
    salaryResearch: jsonb("salary_research").default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("job_roles_user_id_index").on(t.userId),
    roleFamilyIdIndex: index("job_roles_role_family_id_index").on(t.roleFamilyId),
    titleIndex: index("job_roles_title_index").on(t.title),
  }),
)

export const relatedRoles = pgTable(
  "related_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sourceRoleId: uuid("source_role_id")
      .notNull()
      .references(() => jobRoles.id, { onDelete: "cascade" }),
    targetRoleId: uuid("target_role_id")
      .notNull()
      .references(() => jobRoles.id, { onDelete: "cascade" }),
    relationType: text("relation_type").notNull(),
    rationale: text("rationale"),
    evidence: jsonb("evidence").default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    sourceTargetUnique: uniqueIndex("related_roles_source_target_unique").on(t.sourceRoleId, t.targetRoleId, t.relationType),
    targetRoleIdIndex: index("related_roles_target_role_id_index").on(t.targetRoleId),
  }),
)

export const titleAliases = pgTable(
  "title_aliases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobRoleId: uuid("job_role_id")
      .notNull()
      .references(() => jobRoles.id, { onDelete: "cascade" }),
    alias: text("alias").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    jobRoleAliasUnique: uniqueIndex("title_aliases_job_role_alias_unique").on(t.jobRoleId, t.alias),
  }),
)

export const roleTransitions = pgTable(
  "role_transitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fromRoleId: uuid("from_role_id")
      .notNull()
      .references(() => jobRoles.id, { onDelete: "cascade" }),
    toRoleId: uuid("to_role_id")
      .notNull()
      .references(() => jobRoles.id, { onDelete: "cascade" }),
    rationale: text("rationale"),
    evidence: jsonb("evidence").default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    fromToUnique: uniqueIndex("role_transitions_from_to_unique").on(t.fromRoleId, t.toRoleId),
  }),
)

export const roleKeywords = pgTable(
  "role_keywords",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobRoleId: uuid("job_role_id")
      .notNull()
      .references(() => jobRoles.id, { onDelete: "cascade" }),
    keyword: text("keyword").notNull(),
    category: text("category").notNull().default("skill"),
    priority: integer("priority").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    jobRoleKeywordUnique: uniqueIndex("role_keywords_job_role_keyword_unique").on(t.jobRoleId, t.keyword),
  }),
)

export const booleanQueries = pgTable(
  "boolean_queries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    queryType: text("query_type").notNull(),
    query: text("query").notNull(),
    titles: jsonb("titles").default([]),
    aliases: jsonb("aliases").default([]),
    skills: jsonb("skills").default([]),
    locations: jsonb("locations").default([]),
    companies: jsonb("companies").default([]),
    industries: jsonb("industries").default([]),
    seniority: jsonb("seniority").default([]),
    saved: boolean("saved").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("boolean_queries_user_id_index").on(t.userId),
    queryTypeIndex: index("boolean_queries_query_type_index").on(t.queryType),
  }),
)

export const searchMatrices = pgTable(
  "search_matrices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobRoleId: uuid("job_role_id").references(() => jobRoles.id, { onDelete: "set null" }),
    matrix: jsonb("matrix").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("search_matrices_user_id_index").on(t.userId),
    jobRoleIdIndex: index("search_matrices_job_role_id_index").on(t.jobRoleId),
  }),
)

export const jobSources = pgTable(
  "job_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    sourceType: text("source_type").notNull(),
    baseUrl: text("base_url"),
    authorized: boolean("authorized").notNull().default(false),
    config: jsonb("config").default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("job_sources_user_id_index").on(t.userId),
  }),
)

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    domain: text("domain"),
    industry: text("industry"),
    description: text("description"),
    locations: jsonb("locations").default([]),
    careerPages: jsonb("career_pages").default([]),
    websiteUrl: text("website_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("companies_user_id_index").on(t.userId),
    domainIndex: index("companies_domain_index").on(t.domain),
    nameIndex: index("companies_name_index").on(t.name),
  }),
)

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sourceId: uuid("source_id").references(() => jobSources.id, { onDelete: "set null" }),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
    externalJobId: text("external_job_id"),
    title: text("title").notNull(),
    companyName: text("company_name").notNull(),
    location: text("location"),
    remote: boolean("remote").notNull().default(false),
    salaryMin: numeric("salary_min", { precision: 12, scale: 2 }),
    salaryMax: numeric("salary_max", { precision: 12, scale: 2 }),
    currency: text("currency").default("USD"),
    employmentType: text("employment_type"),
    description: text("description").notNull(),
    requirements: jsonb("requirements").default({}),
    skills: jsonb("skills").default([]),
    sourceUrl: text("source_url"),
    postedDate: timestamp("posted_date"),
    closingDate: timestamp("closing_date"),
    status: text("status").notNull().default("NEW"),
    canonicalUrl: text("canonical_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("jobs_user_id_index").on(t.userId),
    sourceIdIndex: index("jobs_source_id_index").on(t.sourceId),
    companyIdIndex: index("jobs_company_id_index").on(t.companyId),
    externalJobIdIndex: index("jobs_external_job_id_index").on(t.externalJobId),
    canonicalUrlIndex: uniqueIndex("jobs_canonical_url_unique").on(t.canonicalUrl),
    statusIndex: index("jobs_status_index").on(t.status),
  }),
)

export const jobSnapshots = pgTable(
  "job_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    snapshot: jsonb("snapshot").notNull().default({}),
    capturedAt: timestamp("captured_at").defaultNow().notNull(),
  },
  (t) => ({
    jobIdIndex: index("job_snapshots_job_id_index").on(t.jobId),
  }),
)

export const jobMatches = pgTable(
  "job_matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    jobRoleId: uuid("job_role_id").references(() => jobRoles.id, { onDelete: "set null" }),
    matchData: jsonb("match_data").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    jobIdIndex: index("job_matches_job_id_index").on(t.jobId),
    jobRoleIdIndex: index("job_matches_job_role_id_index").on(t.jobRoleId),
  }),
)

export const jobScores = pgTable(
  "job_scores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    dimension: text("dimension").notNull(),
    score: numeric("score", { precision: 5, scale: 2 }).notNull(),
    reasons: jsonb("reasons").default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    jobIdIndex: index("job_scores_job_id_index").on(t.jobId),
    dimensionIndex: index("job_scores_dimension_index").on(t.dimension),
  }),
)

export const companyIntelligence = pgTable(
  "company_intelligence",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    claim: text("claim").notNull(),
    sourceUrl: text("source_url"),
    retrievedAt: timestamp("retrieved_at").defaultNow().notNull(),
    sourceType: text("source_type").notNull(),
    verificationStatus: text("verification_status").notNull().default("UNKNOWN"),
    content: jsonb("content").default({}),
  },
  (t) => ({
    companyIdIndex: index("company_intelligence_company_id_index").on(t.companyId),
    retrievedAtIndex: index("company_intelligence_retrieved_at_index").on(t.retrievedAt),
  }),
)

export const targetCompanies = pgTable(
  "target_companies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    priority: text("priority").notNull().default("medium"),
    status: text("status").notNull().default("TARGETING"),
    notes: text("notes"),
    networkability: text("networkability").default("UNKNOWN"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("target_companies_user_id_index").on(t.userId),
    companyIdIndex: index("target_companies_company_id_index").on(t.companyId),
  }),
)

export const companyRoles = pgTable(
  "company_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    jobRoleId: uuid("job_role_id")
      .notNull()
      .references(() => jobRoles.id, { onDelete: "cascade" }),
    isTarget: boolean("is_target").notNull().default(false),
    rationale: text("rationale"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    companyIdIndex: index("company_roles_company_id_index").on(t.companyId),
    jobRoleIdIndex: index("company_roles_job_role_id_index").on(t.jobRoleId),
  }),
)

export const people = pgTable(
  "people",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    title: text("title"),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
    profileUrl: text("profile_url"),
    categories: jsonb("categories").default([]),
    sourceUrl: text("source_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("people_user_id_index").on(t.userId),
    companyIdIndex: index("people_company_id_index").on(t.companyId),
    nameIndex: index("people_name_index").on(t.name),
  }),
)

export const companyPeople = pgTable(
  "company_people",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
    category: text("category").notNull(),
    relevance: text("relevance"),
    sourceUrl: text("source_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    companyIdIndex: index("company_people_company_id_index").on(t.companyId),
    personIdIndex: index("company_people_person_id_index").on(t.personId),
  }),
)

export const networkContacts = pgTable(
  "network_contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    personId: uuid("person_id").references(() => people.id, { onDelete: "set null" }),
    jobId: uuid("job_id").references(() => jobs.id, { onDelete: "set null" }),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
    category: text("category").notNull(),
    relationshipType: text("relationship_type"),
    whyRelevant: text("why_relevant"),
    source: text("source"),
    profileUrl: text("profile_url"),
    stage: text("stage").notNull().default("FOUND"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("network_contacts_user_id_index").on(t.userId),
    personIdIndex: index("network_contacts_person_id_index").on(t.personId),
    jobIdIndex: index("network_contacts_job_id_index").on(t.jobId),
    companyIdIndex: index("network_contacts_company_id_index").on(t.companyId),
    stageIndex: index("network_contacts_stage_index").on(t.stage),
  }),
)

export const networkRelationships = pgTable(
  "network_relationships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contactId: uuid("contact_id")
      .notNull()
      .references(() => networkContacts.id, { onDelete: "cascade" }),
    relationshipType: text("relationship_type").notNull(),
    status: text("status").notNull().default("FOUND"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    contactIdIndex: index("network_relationships_contact_id_index").on(t.contactId),
  }),
)

export const networkSequences = pgTable(
  "network_sequences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: text("category").notNull(),
    steps: jsonb("steps").notNull().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("network_sequences_user_id_index").on(t.userId),
  }),
)

export const networkMessages = pgTable(
  "network_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    contactId: uuid("contact_id")
      .notNull()
      .references(() => networkContacts.id, { onDelete: "cascade" }),
    sequenceId: uuid("sequence_id").references(() => networkSequences.id, { onDelete: "set null" }),
    stage: text("stage").notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("DRAFT"),
    externalActionStatus: text("external_action_status").notNull().default("AI_GENERATED"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    sentAt: timestamp("sent_at"),
  },
  (t) => ({
    contactIdIndex: index("network_messages_contact_id_index").on(t.contactId),
    statusIndex: index("network_messages_status_index").on(t.status),
  }),
)

export const networkEvents = pgTable(
  "network_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contactId: uuid("contact_id")
      .notNull()
      .references(() => networkContacts.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(),
    occurredAt: timestamp("occurred_at").defaultNow().notNull(),
    notes: text("notes"),
  },
  (t) => ({
    contactIdIndex: index("network_events_contact_id_index").on(t.contactId),
  }),
)

export const recruitmentAgencies = pgTable(
  "recruitment_agencies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    agency: text("agency").notNull(),
    recruiter: text("recruiter"),
    specialization: text("specialization"),
    roles: jsonb("roles").default([]),
    location: text("location"),
    contact: jsonb("contact").default({}),
    relationshipStatus: text("relationship_status").notNull().default("NEW"),
    lastContact: timestamp("last_contact"),
    nextAction: text("next_action"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("recruitment_agencies_user_id_index").on(t.userId),
  }),
)

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
    applicationDate: timestamp("application_date"),
    source: text("source"),
    resumeVersionId: uuid("resume_version_id").references(() => resumeVersions.id, { onDelete: "set null" }),
    coverLetterId: uuid("cover_letter_id"),
    status: text("status").notNull().default("SAVED"),
    interviewStage: text("interview_stage"),
    recruiter: text("recruiter"),
    nextAction: text("next_action"),
    followUpDate: timestamp("follow_up_date"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("applications_user_id_index").on(t.userId),
    jobIdIndex: index("applications_job_id_index").on(t.jobId),
    companyIdIndex: index("applications_company_id_index").on(t.companyId),
    statusIndex: index("applications_status_index").on(t.status),
  }),
)

export const applicationEvents = pgTable(
  "application_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(),
    occurredAt: timestamp("occurred_at").defaultNow().notNull(),
    notes: text("notes"),
  },
  (t) => ({
    applicationIdIndex: index("application_events_application_id_index").on(t.applicationId),
  }),
)

export const opportunities = pgTable(
  "opportunities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: uuid("job_id").references(() => jobs.id, { onDelete: "cascade" }),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
    applicationId: uuid("application_id").references(() => applications.id, { onDelete: "set null" }),
    status: text("status").notNull().default("DISCOVERED"),
    nextAction: text("next_action"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("opportunities_user_id_index").on(t.userId),
    jobIdIndex: index("opportunities_job_id_index").on(t.jobId),
    companyIdIndex: index("opportunities_company_id_index").on(t.companyId),
  }),
)

export const atsAnalyses = pgTable(
  "ats_analyses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: uuid("job_id").references(() => jobs.id, { onDelete: "cascade" }),
    resumeVersionId: uuid("resume_version_id").references(() => resumeVersions.id, { onDelete: "set null" }),
    tailoredResumeId: uuid("tailored_resume_id").references(() => tailoredResumes.id, { onDelete: "set null" }),
    score: numeric("score", { precision: 5, scale: 2 }),
    keywordCoverage: numeric("keyword_coverage", { precision: 5, scale: 2 }),
    semanticAlignment: numeric("semantic_alignment", { precision: 5, scale: 2 }),
    experienceAlignment: numeric("experience_alignment", { precision: 5, scale: 2 }),
    titleAlignment: numeric("title_alignment", { precision: 5, scale: 2 }),
    formattingChecks: jsonb("formatting_checks").default({}),
    analysis: jsonb("analysis").default({}),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("ats_analyses_user_id_index").on(t.userId),
    jobIdIndex: index("ats_analyses_job_id_index").on(t.jobId),
    resumeVersionIdIndex: index("ats_analyses_resume_version_id_index").on(t.resumeVersionId),
  }),
)

export const atsKeywords = pgTable(
  "ats_keywords",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    atsAnalysisId: uuid("ats_analysis_id")
      .notNull()
      .references(() => atsAnalyses.id, { onDelete: "cascade" }),
    keyword: text("keyword").notNull(),
    category: text("category").notNull(),
    status: text("status").notNull(),
    priority: text("priority").notNull().default("normal"),
    evidenceStatus: text("evidence_status").notNull().default("UNKNOWN"),
  },
  (t) => ({
    atsAnalysisIdIndex: index("ats_keywords_ats_analysis_id_index").on(t.atsAnalysisId),
  }),
)

export const coverLetters = pgTable(
  "cover_letters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: uuid("job_id").references(() => jobs.id, { onDelete: "cascade" }),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
    applicationId: uuid("application_id").references(() => applications.id, { onDelete: "set null" }),
    tone: text("tone").notNull().default("formal"),
    content: text("content").notNull(),
    evidenceUsed: jsonb("evidence_used").default([]),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("cover_letters_user_id_index").on(t.userId),
    jobIdIndex: index("cover_letters_job_id_index").on(t.jobId),
  }),
)

export const linkedinProfiles = pgTable(
  "linkedin_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    headline: text("headline"),
    about: text("about"),
    experience: jsonb("experience").default([]),
    skills: jsonb("skills").default([]),
    targetRole: text("target_role"),
    lastAuditAt: timestamp("last_audit_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userUnique: uniqueIndex("linkedin_profile_user_unique").on(t.userId),
  }),
)

export const linkedinAudits = pgTable(
  "linkedin_audits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    linkedinProfileId: uuid("linkedin_profile_id")
      .notNull()
      .references(() => linkedinProfiles.id, { onDelete: "cascade" }),
    section: text("section").notNull(),
    current: text("current"),
    recommended: text("recommended"),
    reason: text("reason"),
    evidenceUsed: jsonb("evidence_used").default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    linkedinProfileIdIndex: index("linkedin_audits_profile_id_index").on(t.linkedinProfileId),
  }),
)

export const linkedinContent = pgTable(
  "linkedin_content",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    contentType: text("content_type").notNull(),
    text: text("text").notNull(),
    status: text("status").notNull().default("DRAFT"),
    publishedAt: timestamp("published_at"),
    evidence: jsonb("evidence").default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("linkedin_content_user_id_index").on(t.userId),
    statusIndex: index("linkedin_content_status_index").on(t.status),
  }),
)

export const contentPillars = pgTable(
  "content_pillars",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    evidence: jsonb("evidence").default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("content_pillars_user_id_index").on(t.userId),
  }),
)

export const contentCalendar = pgTable(
  "content_calendar",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    linkedinContentId: uuid("linkedin_content_id").references(() => linkedinContent.id, { onDelete: "set null" }),
    scheduledFor: timestamp("scheduled_for").notNull(),
    status: text("status").notNull().default("PLANNED"),
    engagement: jsonb("engagement").default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("content_calendar_user_id_index").on(t.userId),
    scheduledForIndex: index("content_calendar_scheduled_for_index").on(t.scheduledFor),
  }),
)

export const contentEngagement = pgTable(
  "content_engagement",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    linkedinContentId: uuid("linkedin_content_id")
      .notNull()
      .references(() => linkedinContent.id, { onDelete: "cascade" }),
    metric: text("metric").notNull(),
    value: numeric("value", { precision: 12, scale: 2 }).notNull(),
    observedAt: timestamp("observed_at").defaultNow().notNull(),
  },
  (t) => ({
    contentIdIndex: index("content_engagement_content_id_index").on(t.linkedinContentId),
  }),
)

export const influencerOpportunities = pgTable(
  "influencer_opportunities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sourceUrl: text("source_url"),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").notNull().default("DISCOVERED"),
    relatedContentId: uuid("related_content_id").references(() => linkedinContent.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("influencer_opportunities_user_id_index").on(t.userId),
  }),
)

export const winProjects = pgTable(
  "win_projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: uuid("job_id").references(() => jobs.id, { onDelete: "cascade" }),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
    companyProblem: text("company_problem"),
    evidence: jsonb("evidence").default([]),
    hypothesis: text("hypothesis"),
    proposedSolution: jsonb("proposed_solution").default({}),
    implementationPlan: jsonb("implementation_plan").default({}),
    metrics: jsonb("metrics").default([]),
    risks: jsonb("risks").default([]),
    day90Plan: jsonb("day_90_plan").default({}),
    expectedImpact: text("expected_impact"),
    whyCandidate: text("why_candidate"),
    status: text("status").notNull().default("DRAFT"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("win_projects_user_id_index").on(t.userId),
    jobIdIndex: index("win_projects_job_id_index").on(t.jobId),
    companyIdIndex: index("win_projects_company_id_index").on(t.companyId),
  }),
)

export const interviewSessions = pgTable(
  "interview_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: uuid("job_id").references(() => jobs.id, { onDelete: "cascade" }),
    jobRoleId: uuid("job_role_id").references(() => jobRoles.id, { onDelete: "set null" }),
    sessionType: text("session_type").notNull(),
    status: text("status").notNull().default("IN_PROGRESS"),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
    feedback: jsonb("feedback").default({}),
  },
  (t) => ({
    userIdIndex: index("interview_sessions_user_id_index").on(t.userId),
    jobIdIndex: index("interview_sessions_job_id_index").on(t.jobId),
  }),
)

export const interviewQuestions = pgTable(
  "interview_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    interviewSessionId: uuid("interview_session_id")
      .notNull()
      .references(() => interviewSessions.id, { onDelete: "cascade" }),
    category: text("category").notNull(),
    question: text("question").notNull(),
    orderIndex: integer("order_index").notNull().default(0),
  },
  (t) => ({
    sessionIdIndex: index("interview_questions_session_id_index").on(t.interviewSessionId),
  }),
)

export const interviewAnswers = pgTable(
  "interview_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    interviewQuestionId: uuid("interview_question_id")
      .notNull()
      .references(() => interviewQuestions.id, { onDelete: "cascade" }),
    answer: text("answer").notNull(),
    evidence: jsonb("evidence").default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    questionIdIndex: index("interview_answers_question_id_index").on(t.interviewQuestionId),
  }),
)

export const interviewFeedback = pgTable(
  "interview_feedback",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    interviewSessionId: uuid("interview_session_id")
      .notNull()
      .references(() => interviewSessions.id, { onDelete: "cascade" }),
    dimension: text("dimension").notNull(),
    score: numeric("score", { precision: 5, scale: 2 }),
    notes: text("notes"),
    evidence: jsonb("evidence").default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    sessionIdIndex: index("interview_feedback_session_id_index").on(t.interviewSessionId),
  }),
)

export const negotiations = pgTable(
  "negotiations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }),
    marketContext: jsonb("market_context").default({}),
    compensationComponents: jsonb("compensation_components").default({}),
    counterofferStrategy: jsonb("counteroffer_strategy").default({}),
    counterScript: text("counter_script"),
    pushbackSimulation: jsonb("pushback_simulation").default({}),
    finalPlan: jsonb("final_plan").default({}),
    status: text("status").notNull().default("DRAFT"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("negotiations_user_id_index").on(t.userId),
    applicationIdIndex: index("negotiations_application_id_index").on(t.applicationId),
  }),
)

export const salaryResearch = pgTable(
  "salary_research",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    seniority: text("seniority"),
    location: text("location"),
    sourceUrl: text("source_url").notNull(),
    retrievedAt: timestamp("retrieved_at").defaultNow().notNull(),
    salaryMin: numeric("salary_min", { precision: 12, scale: 2 }),
    salaryMax: numeric("salary_max", { precision: 12, scale: 2 }),
    currency: text("currency").default("USD"),
    sampleSize: integer("sample_size"),
    methodology: text("methodology"),
  },
  (t) => ({
    userIdIndex: index("salary_research_user_id_index").on(t.userId),
    roleIndex: index("salary_research_role_index").on(t.role),
  }),
)

export const dailyActions = pgTable(
  "daily_actions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    priority: text("priority").notNull().default("medium"),
    deadline: timestamp("deadline"),
    reason: text("reason").notNull(),
    relatedEntityType: text("related_entity_type"),
    relatedEntityId: uuid("related_entity_id"),
    recommendedAction: text("recommended_action").notNull(),
    status: text("status").notNull().default("OPEN"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("daily_actions_user_id_index").on(t.userId),
    deadlineIndex: index("daily_actions_deadline_index").on(t.deadline),
  }),
)

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    priority: text("priority").notNull().default("medium"),
    deadline: timestamp("deadline"),
    relatedEntityType: text("related_entity_type"),
    relatedEntityId: uuid("related_entity_id"),
    status: text("status").notNull().default("OPEN"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("tasks_user_id_index").on(t.userId),
    statusIndex: index("tasks_status_index").on(t.status),
  }),
)

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    message: text("message").notNull(),
    relatedEntityType: text("related_entity_type"),
    relatedEntityId: uuid("related_entity_id"),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("notifications_user_id_index").on(t.userId),
    readIndex: index("notifications_read_index").on(t.read),
  }),
)

export const aiProviders = pgTable(
  "ai_providers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    model: text("model").notNull(),
    status: text("status").notNull().default("UNKNOWN"),
    priority: integer("priority").notNull().default(100),
    isFree: boolean("is_free").notNull().default(false),
    freeTierVerifiedAt: timestamp("free_tier_verified_at"),
    contextLimit: integer("context_limit"),
    capabilities: jsonb("capabilities").default({}),
    fallbackProviderId: uuid("fallback_provider_id"),
    enabled: boolean("enabled").notNull().default(false),
    freeOnly: boolean("free_only").notNull().default(false),
    requestCount: integer("request_count").notNull().default(0),
    errorCount: integer("error_count").notNull().default(0),
    cooldownUntil: timestamp("cooldown_until"),
    dailyUsage: jsonb("daily_usage").default({}),
    monthlyUsage: jsonb("monthly_usage").default({}),
    lastUsed: timestamp("last_used"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("ai_providers_user_id_index").on(t.userId),
    providerModelIndex: uniqueIndex("ai_providers_provider_model_unique").on(t.userId, t.provider, t.model),
    fallbackProviderIdIndex: index("ai_providers_fallback_provider_id_index").on(t.fallbackProviderId),
  }),
)

export const aiProviderKeys = pgTable(
  "ai_provider_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => aiProviders.id, { onDelete: "cascade" }),
    encryptedSecretReference: text("encrypted_secret_reference").notNull(),
    status: text("status").notNull().default("ENABLED"),
    health: text("health").notNull().default("UNKNOWN"),
    priority: integer("priority").notNull().default(0),
    usage: jsonb("usage").default({}),
    lastUsed: timestamp("last_used"),
    cooldownUntil: timestamp("cooldown_until"),
    errorCount: integer("error_count").notNull().default(0),
    keyVersion: integer("key_version").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    providerIdIndex: index("ai_provider_keys_provider_id_index").on(t.providerId),
    statusIndex: index("ai_provider_keys_status_index").on(t.status),
  }),
)

export const aiUsage = pgTable(
  "ai_usage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerId: uuid("provider_id").references(() => aiProviders.id, { onDelete: "set null" }),
    providerKeyId: uuid("provider_key_id").references(() => aiProviderKeys.id, { onDelete: "set null" }),
    taskType: text("task_type").notNull(),
    model: text("model").notNull(),
    freeOnly: boolean("free_only").notNull().default(false),
    status: text("status").notNull(),
    latencyMs: integer("latency_ms"),
    tokensIn: integer("tokens_in"),
    tokensOut: integer("tokens_out"),
    estimatedCost: numeric("estimated_cost", { precision: 12, scale: 6 }),
    errorCode: text("error_code"),
    requestId: text("request_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("ai_usage_user_id_index").on(t.userId),
    providerIdIndex: index("ai_usage_provider_id_index").on(t.providerId),
    createdAtIndex: index("ai_usage_created_at_index").on(t.createdAt),
    taskTypeIndex: index("ai_usage_task_type_index").on(t.taskType),
  }),
)

export const aiCache = pgTable(
  "ai_cache",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cacheKey: text("cache_key").notNull(),
    taskType: text("task_type").notNull(),
    inputHash: text("input_hash").notNull(),
    modelVersion: text("model_version").notNull(),
    promptVersion: text("prompt_version").notNull(),
    result: jsonb("result").notNull(),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdIndex: index("ai_cache_user_id_index").on(t.userId),
    cacheKeyUnique: uniqueIndex("ai_cache_cache_key_unique").on(t.userId, t.cacheKey),
    inputHashIndex: index("ai_cache_input_hash_index").on(t.inputHash),
  }),
)

export const memoryExports = pgTable(
  "memory_exports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    format: text("format").notNull(),
    status: text("status").notNull().default("QUEUED"),
    fileUrl: text("file_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
  },
  (t) => ({
    userIdIndex: index("memory_exports_user_id_index").on(t.userId),
    statusIndex: index("memory_exports_status_index").on(t.status),
  }),
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type AuthSession = typeof authSessions.$inferSelect
export type NewAuthSession = typeof authSessions.$inferInsert
export type Setting = typeof settings.$inferSelect
export type NewSetting = typeof settings.$inferInsert
export type AuditLog = typeof auditLogs.$inferSelect
export type NewAuditLog = typeof auditLogs.$inferInsert
export type SourceCitation = typeof sourceCitations.$inferSelect
export type NewSourceCitation = typeof sourceCitations.$inferInsert
export type CareerProfile = typeof careerProfiles.$inferSelect
export type NewCareerProfile = typeof careerProfiles.$inferInsert
export type CareerDna = typeof careerDna.$inferSelect
export type NewCareerDna = typeof careerDna.$inferInsert
export type CareerEvidence = typeof careerEvidence.$inferSelect
export type NewCareerEvidence = typeof careerEvidence.$inferInsert
export type Achievement = typeof achievements.$inferSelect
export type NewAchievement = typeof achievements.$inferInsert
export type CarStory = typeof carStories.$inferSelect
export type NewCarStory = typeof carStories.$inferInsert
export type Skill = typeof skills.$inferSelect
export type NewSkill = typeof skills.$inferInsert
export type SkillEvidence = typeof skillEvidence.$inferSelect
export type NewSkillEvidence = typeof skillEvidence.$inferInsert
export type Certification = typeof certifications.$inferSelect
export type NewCertification = typeof certifications.$inferInsert
export type Education = typeof education.$inferSelect
export type NewEducation = typeof education.$inferInsert
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type WorkExperience = typeof workExperience.$inferSelect
export type NewWorkExperience = typeof workExperience.$inferInsert
export type MasterResume = typeof masterResumes.$inferSelect
export type NewMasterResume = typeof masterResumes.$inferInsert
export type ResumeVersion = typeof resumeVersions.$inferSelect
export type NewResumeVersion = typeof resumeVersions.$inferInsert
export type TailoredResume = typeof tailoredResumes.$inferSelect
export type NewTailoredResume = typeof tailoredResumes.$inferInsert
export type ResumeSection = typeof resumeSections.$inferSelect
export type NewResumeSection = typeof resumeSections.$inferInsert
export type RoleFamily = typeof roleFamilies.$inferSelect
export type NewRoleFamily = typeof roleFamilies.$inferInsert
export type JobRole = typeof jobRoles.$inferSelect
export type NewJobRole = typeof jobRoles.$inferInsert
export type RelatedRole = typeof relatedRoles.$inferSelect
export type NewRelatedRole = typeof relatedRoles.$inferInsert
export type TitleAlias = typeof titleAliases.$inferSelect
export type NewTitleAlias = typeof titleAliases.$inferInsert
export type RoleTransition = typeof roleTransitions.$inferSelect
export type NewRoleTransition = typeof roleTransitions.$inferInsert
export type RoleKeyword = typeof roleKeywords.$inferSelect
export type NewRoleKeyword = typeof roleKeywords.$inferInsert
export type BooleanQuery = typeof booleanQueries.$inferSelect
export type NewBooleanQuery = typeof booleanQueries.$inferInsert
export type SearchMatrix = typeof searchMatrices.$inferSelect
export type NewSearchMatrix = typeof searchMatrices.$inferInsert
export type JobSource = typeof jobSources.$inferSelect
export type NewJobSource = typeof jobSources.$inferInsert
export type Company = typeof companies.$inferSelect
export type NewCompany = typeof companies.$inferInsert
export type Job = typeof jobs.$inferSelect
export type NewJob = typeof jobs.$inferInsert
export type JobSnapshot = typeof jobSnapshots.$inferSelect
export type NewJobSnapshot = typeof jobSnapshots.$inferInsert
export type JobMatch = typeof jobMatches.$inferSelect
export type NewJobMatch = typeof jobMatches.$inferInsert
export type JobScore = typeof jobScores.$inferSelect
export type NewJobScore = typeof jobScores.$inferInsert
export type CompanyIntelligence = typeof companyIntelligence.$inferSelect
export type NewCompanyIntelligence = typeof companyIntelligence.$inferInsert
export type TargetCompany = typeof targetCompanies.$inferSelect
export type NewTargetCompany = typeof targetCompanies.$inferInsert
export type CompanyRole = typeof companyRoles.$inferSelect
export type NewCompanyRole = typeof companyRoles.$inferInsert
export type Person = typeof people.$inferSelect
export type NewPerson = typeof people.$inferInsert
export type CompanyPerson = typeof companyPeople.$inferSelect
export type NewCompanyPerson = typeof companyPeople.$inferInsert
export type NetworkContact = typeof networkContacts.$inferSelect
export type NewNetworkContact = typeof networkContacts.$inferInsert
export type NetworkRelationship = typeof networkRelationships.$inferSelect
export type NewNetworkRelationship = typeof networkRelationships.$inferInsert
export type NetworkSequence = typeof networkSequences.$inferSelect
export type NewNetworkSequence = typeof networkSequences.$inferInsert
export type NetworkMessage = typeof networkMessages.$inferSelect
export type NewNetworkMessage = typeof networkMessages.$inferInsert
export type NetworkEvent = typeof networkEvents.$inferSelect
export type NewNetworkEvent = typeof networkEvents.$inferInsert
export type RecruitmentAgency = typeof recruitmentAgencies.$inferSelect
export type NewRecruitmentAgency = typeof recruitmentAgencies.$inferInsert
export type Application = typeof applications.$inferSelect
export type NewApplication = typeof applications.$inferInsert
export type ApplicationEvent = typeof applicationEvents.$inferSelect
export type NewApplicationEvent = typeof applicationEvents.$inferInsert
export type Opportunity = typeof opportunities.$inferSelect
export type NewOpportunity = typeof opportunities.$inferInsert
export type AtsAnalysis = typeof atsAnalyses.$inferSelect
export type NewAtsAnalysis = typeof atsAnalyses.$inferInsert
export type AtsKeyword = typeof atsKeywords.$inferSelect
export type NewAtsKeyword = typeof atsKeywords.$inferInsert
export type CoverLetter = typeof coverLetters.$inferSelect
export type NewCoverLetter = typeof coverLetters.$inferInsert
export type LinkedinProfile = typeof linkedinProfiles.$inferSelect
export type NewLinkedinProfile = typeof linkedinProfiles.$inferInsert
export type LinkedinAudit = typeof linkedinAudits.$inferSelect
export type NewLinkedinAudit = typeof linkedinAudits.$inferInsert
export type LinkedinContent = typeof linkedinContent.$inferSelect
export type NewLinkedinContent = typeof linkedinContent.$inferInsert
export type ContentPillar = typeof contentPillars.$inferSelect
export type NewContentPillar = typeof contentPillars.$inferInsert
export type ContentCalendar = typeof contentCalendar.$inferSelect
export type NewContentCalendar = typeof contentCalendar.$inferInsert
export type ContentEngagement = typeof contentEngagement.$inferSelect
export type NewContentEngagement = typeof contentEngagement.$inferInsert
export type InfluencerOpportunity = typeof influencerOpportunities.$inferSelect
export type NewInfluencerOpportunity = typeof influencerOpportunities.$inferInsert
export type WinProject = typeof winProjects.$inferSelect
export type NewWinProject = typeof winProjects.$inferInsert
export type InterviewSession = typeof interviewSessions.$inferSelect
export type NewInterviewSession = typeof interviewSessions.$inferInsert
export type InterviewQuestion = typeof interviewQuestions.$inferSelect
export type NewInterviewQuestion = typeof interviewQuestions.$inferInsert
export type InterviewAnswer = typeof interviewAnswers.$inferSelect
export type NewInterviewAnswer = typeof interviewAnswers.$inferInsert
export type InterviewFeedback = typeof interviewFeedback.$inferSelect
export type NewInterviewFeedback = typeof interviewFeedback.$inferInsert
export type Negotiation = typeof negotiations.$inferSelect
export type NewNegotiation = typeof negotiations.$inferInsert
export type SalaryResearch = typeof salaryResearch.$inferSelect
export type NewSalaryResearch = typeof salaryResearch.$inferInsert
export type DailyAction = typeof dailyActions.$inferSelect
export type NewDailyAction = typeof dailyActions.$inferInsert
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert
export type AiProvider = typeof aiProviders.$inferSelect
export type NewAiProvider = typeof aiProviders.$inferInsert
export type AiProviderKey = typeof aiProviderKeys.$inferSelect
export type NewAiProviderKey = typeof aiProviderKeys.$inferInsert
export type AiUsage = typeof aiUsage.$inferSelect
export type NewAiUsage = typeof aiUsage.$inferInsert
export type AiCache = typeof aiCache.$inferSelect
export type NewAiCache = typeof aiCache.$inferInsert
export type MemoryExport = typeof memoryExports.$inferSelect
export type NewMemoryExport = typeof memoryExports.$inferInsert
