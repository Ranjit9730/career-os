"use server"

import "server-only"

import { db } from "@/db/client"
import { careerDna, careerEvidence, masterResumes, resumeVersions, resumeSections, tailoredResumes, jobs, applications, interviewSessions, careerProfiles, skills, workExperience, projects, achievements, education, certifications, jobRoles, roleFamilies, relatedRoles, companies, jobSnapshots, jobMatches, jobScores, applicationEvents, interviewQuestions, interviewAnswers, interviewFeedback, networkContacts, networkRelationships, networkSequences, networkMessages, recruitmentAgencies, salaryResearch, aiUsage, aiCache } from "@/db/schema"
import { eq, asc } from "drizzle-orm"

export interface CareerDna {
  id: string
  userId: string
  careerIdentity: string
  coreStrengths: string[]
  technicalStrengths: string[]
  domainStrengths: string[]
  transferableSkills: string[]
  evidenceBackedAchievements: string[]
  careerThemes: string[]
  roleFamilies: string[]
  potentialRoleTransitions: string[]
  skillGaps: string[]
  experienceGaps: string[]
  positioningOptions: string[]
  sourceContext: Record<string, any>
  generatedAt: Date
  updatedAt: Date
}

export interface CareerEvidence {
  id: string
  userId: string
  claim: string
  source: string
  sourceType: string
  date: Date | null
  confidence: number
  verificationStatus: string
  relatedRole: string
  relatedSkill: string
  relatedAchievement: string
  metadata: Record<string, any>
  createdAt: Date
}

export interface MasterResume {
  id: string
  userId: string
  title: string
  content: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface MasterResumeFormInput {
  title?: string
  content?: Record<string, any>
}

export async function getCareerDna(userId: string): Promise<CareerDna | null> {
  const rows = await db
    .select({
      id: careerDna.id,
      userId: careerDna.userId,
      careerIdentity: careerDna.careerIdentity,
      coreStrengths: careerDna.coreStrengths,
      technicalStrengths: careerDna.technicalStrengths,
      domainStrengths: careerDna.domainStrengths,
      transferableSkills: careerDna.transferableSkills,
      evidenceBackedAchievements: careerDna.evidenceBackedAchievements,
      careerThemes: careerDna.careerThemes,
      roleFamilies: careerDna.roleFamilies,
      potentialRoleTransitions: careerDna.potentialRoleTransitions,
      skillGaps: careerDna.skillGaps,
      experienceGaps: careerDna.experienceGaps,
      positioningOptions: careerDna.positioningOptions,
      sourceContext: careerDna.sourceContext,
      generatedAt: careerDna.generatedAt,
      updatedAt: careerDna.updatedAt,
    })
    .from(careerDna)
    .where(eq(careerDna.userId, userId))
    .limit(1)

  return rows.length > 0 ? (rows[0] as CareerDna) : null
}

export async function createOrUpdateCareerDna(
  userId: string,
  input: {
    careerIdentity: string
    coreStrengths: string[]
    technicalStrengths: string[]
    domainStrengths: string[]
    transferableSkills: string[]
    evidenceBackedAchievements: string[]
    careerThemes: string[]
    roleFamilies: string[]
    potentialRoleTransitions: string[]
    skillGaps: string[]
    experienceGaps: string[]
    positioningOptions: string[]
    sourceContext?: Record<string, any>
  }
): Promise<CareerDna> {
  const existing = await getCareerDna(userId)

  if (existing) {
    const [row] = await db
      .update(careerDna)
      .set({
        careerIdentity: input.careerIdentity,
        coreStrengths: input.coreStrengths,
        technicalStrengths: input.technicalStrengths,
        domainStrengths: input.domainStrengths,
        transferableSkills: input.transferableSkills,
        evidenceBackedAchievements: input.evidenceBackedAchievements,
        careerThemes: input.careerThemes,
        roleFamilies: input.roleFamilies,
        potentialRoleTransitions: input.potentialRoleTransitions,
        skillGaps: input.skillGaps,
        experienceGaps: input.experienceGaps,
        positioningOptions: input.positioningOptions,
        sourceContext: input.sourceContext ?? existing.sourceContext,
        updatedAt: new Date(),
      })
      .where(eq(careerDna.userId, userId))
      .returning({
        id: careerDna.id,
        userId: careerDna.userId,
        careerIdentity: careerDna.careerIdentity,
        coreStrengths: careerDna.coreStrengths,
        technicalStrengths: careerDna.technicalStrengths,
        domainStrengths: careerDna.domainStrengths,
        transferableSkills: careerDna.transferableSkills,
        evidenceBackedAchievements: careerDna.evidenceBackedAchievements,
        careerThemes: careerDna.careerThemes,
        roleFamilies: careerDna.roleFamilies,
        potentialRoleTransitions: careerDna.potentialRoleTransitions,
        skillGaps: careerDna.skillGaps,
        experienceGaps: careerDna.experienceGaps,
        positioningOptions: careerDna.positioningOptions,
        sourceContext: careerDna.sourceContext,
        generatedAt: careerDna.generatedAt,
        updatedAt: careerDna.updatedAt,
      })

    return row as CareerDna
  } else {
    const [row] = await db
      .insert(careerDna)
      .values({
        userId,
        careerIdentity: input.careerIdentity,
        coreStrengths: input.coreStrengths,
        technicalStrengths: input.technicalStrengths,
        domainStrengths: input.domainStrengths,
        transferableSkills: input.transferableSkills,
        evidenceBackedAchievements: input.evidenceBackedAchievements,
        careerThemes: input.careerThemes,
        roleFamilies: input.roleFamilies,
        potentialRoleTransitions: input.potentialRoleTransitions,
        skillGaps: input.skillGaps,
        experienceGaps: input.experienceGaps,
        positioningOptions: input.positioningOptions,
        sourceContext: input.sourceContext ?? {},
        generatedAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: careerDna.id,
        userId: careerDna.userId,
        careerIdentity: careerDna.careerIdentity,
        coreStrengths: careerDna.coreStrengths,
        technicalStrengths: careerDna.technicalStrengths,
        domainStrengths: careerDna.domainStrengths,
        transferableSkills: careerDna.transferableSkills,
        evidenceBackedAchievements: careerDna.evidenceBackedAchievements,
        careerThemes: careerDna.careerThemes,
        roleFamilies: careerDna.roleFamilies,
        potentialRoleTransitions: careerDna.potentialRoleTransitions,
        skillGaps: careerDna.skillGaps,
        experienceGaps: careerDna.experienceGaps,
        positioningOptions: careerDna.positioningOptions,
        sourceContext: careerDna.sourceContext,
        generatedAt: careerDna.generatedAt,
        updatedAt: careerDna.updatedAt,
      })

    return row as CareerDna
  }
}

export async function createCareerEvidence(
  userId: string,
  input: {
    claim: string
    source: string
    sourceType: string
    date?: Date
    confidence?: number
    verificationStatus?: string
    relatedRole?: string
    relatedSkill?: string
    relatedAchievement?: string
    metadata?: Record<string, any>
  }
): Promise<CareerEvidence> {
  const [row] = await db
    .insert(careerEvidence)
    .values({
      userId,
      claim: input.claim,
      source: input.source ?? null,
      sourceType: input.sourceType,
      date: input.date ?? null,
      confidence: String(input.confidence ?? 0.0000),
      verificationStatus: input.verificationStatus ?? "UNKNOWN",
      relatedRole: input.relatedRole ?? null,
      relatedSkill: input.relatedSkill ?? null,
      relatedAchievement: input.relatedAchievement ?? null,
      metadata: input.metadata ?? {},
      createdAt: new Date(),
    })
    .returning({
      id: careerEvidence.id,
      userId: careerEvidence.userId,
      claim: careerEvidence.claim,
      source: careerEvidence.source,
      sourceType: careerEvidence.sourceType,
      date: careerEvidence.date,
      confidence: careerEvidence.confidence,
      verificationStatus: careerEvidence.verificationStatus,
      relatedRole: careerEvidence.relatedRole,
      relatedSkill: careerEvidence.relatedSkill,
      relatedAchievement: careerEvidence.relatedAchievement,
      metadata: careerEvidence.metadata,
      createdAt: careerEvidence.createdAt,
    })

  const data = row
  return {
    id: data.id,
    userId: data.userId,
    claim: data.claim,
    source: data.source ?? "",
    sourceType: data.sourceType,
    date: data.date,
    confidence: Number(data.confidence),
    verificationStatus: data.verificationStatus,
    relatedRole: data.relatedRole ?? "",
    relatedSkill: data.relatedSkill ?? "",
    relatedAchievement: data.relatedAchievement ?? "",
    metadata: data.metadata as Record<string, any>,
    createdAt: data.createdAt,
  }
}

export async function getMasterResume(userId: string): Promise<MasterResume | null> {
  const rows = await db
    .select({
      id: masterResumes.id,
      userId: masterResumes.userId,
      title: masterResumes.title,
      content: masterResumes.content,
      createdAt: masterResumes.createdAt,
      updatedAt: masterResumes.updatedAt,
    })
    .from(masterResumes)
    .where(eq(masterResumes.userId, userId))
    .limit(1)

  return rows.length > 0 ? (rows[0] as MasterResume) : null
}

export async function createOrUpdateMasterResume(
  userId: string,
  input: MasterResumeFormInput
): Promise<MasterResume> {
  const existing = await getMasterResume(userId)

  if (existing) {
    const [row] = await db
      .update(masterResumes)
      .set({
        title: input.title ?? existing.title,
        content: input.content ?? existing.content,
        updatedAt: new Date(),
      })
      .where(eq(masterResumes.userId, userId))
      .returning({
        id: masterResumes.id,
        userId: masterResumes.userId,
        title: masterResumes.title,
        content: masterResumes.content,
        createdAt: masterResumes.createdAt,
        updatedAt: masterResumes.updatedAt,
      })

    return row as MasterResume
  } else {
    const [row] = await db
      .insert(masterResumes)
      .values({
        userId,
        title: input.title ?? "Master Resume",
        content: input.content ?? {},
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: masterResumes.id,
        userId: masterResumes.userId,
        title: masterResumes.title,
        content: masterResumes.content,
        createdAt: masterResumes.createdAt,
        updatedAt: masterResumes.updatedAt,
      })

    return row as MasterResume
  }
}

export async function getJobs(userId: string) {
  return await db.select({ id: jobs.id, title: jobs.title, companyName: jobs.companyName, status: jobs.status, createdAt: jobs.createdAt }).from(jobs).where(eq(jobs.userId, userId))
}

export async function getApplications(userId: string) {
  return await db.select({ id: applications.id, jobId: applications.jobId, status: applications.status, interviewStage: applications.interviewStage, createdAt: applications.createdAt }).from(applications).where(eq(applications.userId, userId))
}

export async function getInterviewSessions(userId: string) {
  return await db.select({ id: interviewSessions.id, sessionType: interviewSessions.sessionType, status: interviewSessions.status, startedAt: interviewSessions.startedAt }).from(interviewSessions).where(eq(interviewSessions.userId, userId))
}

// Step 1: Career Profile
export async function getCareerProfile(userId: string) {
  const [row] = await db.select({ id: careerProfiles.id, userId: careerProfiles.userId, fullName: careerProfiles.fullName, headline: careerProfiles.headline, location: careerProfiles.location, workMode: careerProfiles.workMode, salaryExpectations: careerProfiles.salaryExpectations, careerGoals: careerProfiles.careerGoals, preferredRoles: careerProfiles.preferredRoles, createdAt: careerProfiles.createdAt, updatedAt: careerProfiles.updatedAt }).from(careerProfiles).where(eq(careerProfiles.userId, userId)).limit(1)
  return row ?? null
}

export async function createOrUpdateCareerProfile(userId: string, input: { fullName?: string, headline?: string, location?: string, workMode?: string, salaryExpectations?: Record<string, any>, careerGoals?: Record<string, any>, preferredRoles?: string[] }) {
  const existing = await getCareerProfile(userId)
  if (existing) {
    const [row] = await db.update(careerProfiles).set({ ...input, updatedAt: new Date() }).where(eq(careerProfiles.userId, userId)).returning({ id: careerProfiles.id, userId: careerProfiles.userId, fullName: careerProfiles.fullName, headline: careerProfiles.headline, location: careerProfiles.location, workMode: careerProfiles.workMode, salaryExpectations: careerProfiles.salaryExpectations, careerGoals: careerProfiles.careerGoals, preferredRoles: careerProfiles.preferredRoles, createdAt: careerProfiles.createdAt, updatedAt: careerProfiles.updatedAt })
    return row
  } else {
    const [row] = await db.insert(careerProfiles).values({ userId, fullName: input.fullName ?? "", headline: input.headline ?? "", location: input.location ?? "", workMode: input.workMode ?? "", salaryExpectations: input.salaryExpectations ?? {}, careerGoals: input.careerGoals ?? {}, preferredRoles: input.preferredRoles ?? [], createdAt: new Date(), updatedAt: new Date() }).returning({ id: careerProfiles.id, userId: careerProfiles.userId, fullName: careerProfiles.fullName, headline: careerProfiles.headline, location: careerProfiles.location, workMode: careerProfiles.workMode, salaryExpectations: careerProfiles.salaryExpectations, careerGoals: careerProfiles.careerGoals, preferredRoles: careerProfiles.preferredRoles, createdAt: careerProfiles.createdAt, updatedAt: careerProfiles.updatedAt })
    return row
  }
}

// Step 3: Work Experience + Projects + Achievements
export async function getWorkExperience(userId: string) {
  return await db.select({ id: workExperience.id, userId: workExperience.userId, company: workExperience.company, title: workExperience.title, startDate: workExperience.startDate, endDate: workExperience.endDate, current: workExperience.current, createdAt: workExperience.createdAt }).from(workExperience).where(eq(workExperience.userId, userId))
}

export async function getProjects(userId: string) {
  return await db.select({ id: projects.id, userId: projects.userId, title: projects.title, description: projects.description, role: projects.role, startDate: projects.startDate, endDate: projects.endDate, createdAt: projects.createdAt }).from(projects).where(eq(projects.userId, userId))
}

export async function getAchievements(userId: string) {
  return await db.select({ id: achievements.id, userId: achievements.userId, title: achievements.title, description: achievements.description, metrics: achievements.metrics, evidenceId: achievements.evidenceId, verificationStatus: achievements.verificationStatus, createdAt: achievements.createdAt }).from(achievements).where(eq(achievements.userId, userId))
}

// Step 2: Skills
export async function getSkills(userId: string) {
  return await db.select({ id: skills.id, userId: skills.userId, name: skills.name, category: skills.category, proficiency: skills.proficiency, description: skills.description, createdAt: skills.createdAt }).from(skills).where(eq(skills.userId, userId))
}

// Step 7: Job Tracking Full
export async function getJobSnapshots(userId: string) {
  return await db.select({ id: jobSnapshots.id, jobId: jobSnapshots.jobId, snapshot: jobSnapshots.snapshot, capturedAt: jobSnapshots.capturedAt }).from(jobSnapshots).where(eq(jobSnapshots.jobId, userId))
}

export async function getJobMatches(userId: string) {
  return await db.select({ id: jobMatches.id, jobId: jobMatches.jobId, jobRoleId: jobMatches.jobRoleId, matchData: jobMatches.matchData, createdAt: jobMatches.createdAt }).from(jobMatches).where(eq(jobMatches.jobId, userId))
}

export async function getJobScores(userId: string) {
  return await db.select({ id: jobScores.id, jobId: jobScores.jobId, dimension: jobScores.dimension, score: jobScores.score, reasons: jobScores.reasons, createdAt: jobScores.createdAt }).from(jobScores).where(eq(jobScores.jobId, userId))
}

// Step 8: Applications Full
export async function getApplicationEvents(userId: string) {
  return await db.select({ id: applicationEvents.id, applicationId: applicationEvents.applicationId, eventType: applicationEvents.eventType, occurredAt: applicationEvents.occurredAt, notes: applicationEvents.notes }).from(applicationEvents).where(eq(applicationEvents.applicationId, userId))
}

// Step 9: Interviews Full
export async function getInterviewQuestions(sessionId: string) {
  return await db.select({ id: interviewQuestions.id, interviewSessionId: interviewQuestions.interviewSessionId, category: interviewQuestions.category, question: interviewQuestions.question, orderIndex: interviewQuestions.orderIndex }).from(interviewQuestions).where(eq(interviewQuestions.interviewSessionId, sessionId))
}

export async function getInterviewAnswers(questionId: string) {
  return await db.select({ id: interviewAnswers.id, interviewQuestionId: interviewAnswers.interviewQuestionId, answer: interviewAnswers.answer, evidence: interviewAnswers.evidence, createdAt: interviewAnswers.createdAt }).from(interviewAnswers).where(eq(interviewAnswers.interviewQuestionId, questionId))
}

export async function getInterviewFeedback(userId: string) {
  return await db.select({ id: interviewFeedback.id, interviewSessionId: interviewFeedback.interviewSessionId, dimension: interviewFeedback.dimension, score: interviewFeedback.score, notes: interviewFeedback.notes, evidence: interviewFeedback.evidence, createdAt: interviewFeedback.createdAt }).from(interviewFeedback).where(eq(interviewFeedback.interviewSessionId, userId))
}

// Step 10: Networking
export async function getNetworkContacts(userId: string) {
  return await db.select({ id: networkContacts.id, userId: networkContacts.userId, personId: networkContacts.personId, category: networkContacts.category, relationshipType: networkContacts.relationshipType, whyRelevant: networkContacts.whyRelevant, source: networkContacts.source, profileUrl: networkContacts.profileUrl, stage: networkContacts.stage, createdAt: networkContacts.createdAt }).from(networkContacts).where(eq(networkContacts.userId, userId))
}

export async function getNetworkRelationships(contactId: string) {
  return await db.select({ id: networkRelationships.id, contactId: networkRelationships.contactId, relationshipType: networkRelationships.relationshipType, status: networkRelationships.status, notes: networkRelationships.notes, createdAt: networkRelationships.createdAt }).from(networkRelationships).where(eq(networkRelationships.contactId, contactId))
}

export async function getNetworkSequences(userId: string) {
  return await db.select({ id: networkSequences.id, userId: networkSequences.userId, name: networkSequences.name, category: networkSequences.category, steps: networkSequences.steps, createdAt: networkSequences.createdAt }).from(networkSequences).where(eq(networkSequences.userId, userId))
}

export async function getNetworkMessages(userId: string) {
  return await db.select({ id: networkMessages.id, userId: networkMessages.userId, contactId: networkMessages.contactId, sequenceId: networkMessages.sequenceId, stage: networkMessages.stage, message: networkMessages.message, status: networkMessages.status, createdAt: networkMessages.createdAt }).from(networkMessages).where(eq(networkMessages.userId, userId))
}

// Step 11: Recruitment
export async function getRecruitmentAgencies(userId: string) {
  return await db.select({ id: recruitmentAgencies.id, userId: recruitmentAgencies.userId, agency: recruitmentAgencies.agency, recruiter: recruitmentAgencies.recruiter, specialization: recruitmentAgencies.specialization, roles: recruitmentAgencies.roles, location: recruitmentAgencies.location, contact: recruitmentAgencies.contact, relationshipStatus: recruitmentAgencies.relationshipStatus, lastContact: recruitmentAgencies.lastContact, nextAction: recruitmentAgencies.nextAction, createdAt: recruitmentAgencies.createdAt }).from(recruitmentAgencies).where(eq(recruitmentAgencies.userId, userId))
}

// Step 4: Education + Certifications
export async function getEducation(userId: string) {
  return await db.select({ id: education.id, userId: education.userId, institution: education.institution, degree: education.degree, fieldOfStudy: education.fieldOfStudy, startDate: education.startDate, endDate: education.endDate, createdAt: education.createdAt }).from(education).where(eq(education.userId, userId))
}

export async function getCertifications(userId: string) {
  return await db.select({ id: certifications.id, userId: certifications.userId, name: certifications.name, issuingOrganization: certifications.issuingOrganization, issuedDate: certifications.issuedDate, expirationDate: certifications.expirationDate, createdAt: certifications.createdAt }).from(certifications).where(eq(certifications.userId, userId))
}

// Step 5: Resume System
export async function getResumeVersions(masterResumeId: string) {
  return await db.select({ id: resumeVersions.id, masterResumeId: resumeVersions.masterResumeId, versionNumber: resumeVersions.versionNumber, template: resumeVersions.template, content: resumeVersions.content, createdAt: resumeVersions.createdAt }).from(resumeVersions).where(eq(resumeVersions.masterResumeId, masterResumeId))
}

// Step 6: Job Intelligence
export async function getJobRoles(userId: string) {
  return await db.select({ id: jobRoles.id, userId: jobRoles.userId, title: jobRoles.title, seniority: jobRoles.seniority, description: jobRoles.description, skills: jobRoles.skills, tools: jobRoles.tools, createdAt: jobRoles.createdAt }).from(jobRoles).where(eq(jobRoles.userId, userId))
}

export async function getRoleFamilies(userId: string) {
  return await db.select({ id: roleFamilies.id, userId: roleFamilies.userId, name: roleFamilies.name, description: roleFamilies.description, createdAt: roleFamilies.createdAt }).from(roleFamilies).where(eq(roleFamilies.userId, userId))
}

export async function getRelatedRoles(userId: string) {
  return await db.select({ id: relatedRoles.id, userId: relatedRoles.userId, sourceRoleId: relatedRoles.sourceRoleId, targetRoleId: relatedRoles.targetRoleId, relationType: relatedRoles.relationType, createdAt: relatedRoles.createdAt }).from(relatedRoles).where(eq(relatedRoles.userId, userId))
}

export async function getCompanies(userId: string) {
  return await db.select({ id: companies.id, userId: companies.userId, name: companies.name, domain: companies.domain, industry: companies.industry, description: companies.description, createdAt: companies.createdAt }).from(companies).where(eq(companies.userId, userId))
}

export async function createSkill(userId: string, input: { name: string, category?: string, proficiency?: string, description?: string }) {
  const [row] = await db.insert(skills).values({ userId, name: input.name, category: input.category ?? "general", proficiency: input.proficiency ?? null, description: input.description ?? null, createdAt: new Date() }).returning({ id: skills.id, userId: skills.userId, name: skills.name, category: skills.category, proficiency: skills.proficiency, description: skills.description, createdAt: skills.createdAt })
  return row
}

// Step 12: Salary + Research
export async function getSalaryResearch(userId: string) {
  return await db.select({ id: salaryResearch.id, userId: salaryResearch.userId, role: salaryResearch.role, seniority: salaryResearch.seniority, location: salaryResearch.location, salaryMin: salaryResearch.salaryMin, salaryMax: salaryResearch.salaryMax, currency: salaryResearch.currency, sourceUrl: salaryResearch.sourceUrl, retrievedAt: salaryResearch.retrievedAt }).from(salaryResearch).where(eq(salaryResearch.userId, userId))
}

// Step 13: AI Analytics
export async function getAiUsage(userId: string) {
  return await db.select({ id: aiUsage.id, userId: aiUsage.userId, provider: aiUsage.provider, model: aiUsage.model, requestCount: aiUsage.requestCount, tokenCount: aiUsage.tokenCount, costEstimate: aiUsage.costEstimate, recordedAt: aiUsage.recordedAt }).from(aiUsage).where(eq(aiUsage.userId, userId))
}

export async function getAiCache(userId: string) {
  return await db.select({ id: aiCache.id, userId: aiCache.userId, key: aiCache.key, value: aiCache.value, expiresAt: aiCache.expiresAt, createdAt: aiCache.createdAt }).from(aiCache).where(eq(aiCache.userId, userId))
}