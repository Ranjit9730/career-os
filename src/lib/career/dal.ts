"use server"

import "server-only"

import { db } from "@/db/client"
import { careerDna, careerEvidence, masterResumes, resumeVersions } from "@/db/schema"
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
  const rows = await db.select().from(careerDna).where(eq(careerDna.userId, userId)).limit(1)
  return rows.length > 0 ? rows[0] : null
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
      .returning()

    const data = row
    return {
      id: data.id,
      userId: data.userId,
      careerIdentity: data.careerIdentity,
      coreStrengths: data.coreStrengths,
      technicalStrengths: data.technicalStrengths,
      domainStrengths: data.domainStrengths,
      transferableSkills: data.transferableSkills,
      evidenceBackedAchievements: data.evidenceBackedAchievements,
      careerThemes: data.careerThemes,
      roleFamilies: data.roleFamilies,
      potentialRoleTransitions: data.potentialRoleTransitions,
      skillGaps: data.skillGaps,
      experienceGaps: data.experienceGaps,
      positioningOptions: data.positioningOptions,
      sourceContext: data.sourceContext,
      generatedAt: data.generatedAt,
      updatedAt: data.updatedAt,
    }
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
      .returning()

    const data = row
    return {
      id: data.id,
      userId: data.userId,
      careerIdentity: data.careerIdentity,
      coreStrengths: data.coreStrengths,
      technicalStrengths: data.technicalStrengths,
      domainStrengths: data.domainStrengths,
      transferableSkills: data.transferableSkills,
      evidenceBackedAchievements: data.evidenceBackedAchievements,
      careerThemes: data.careerThemes,
      roleFamilies: data.roleFamilies,
      potentialRoleTransitions: data.potentialRoleTransitions,
      skillGaps: data.skillGaps,
      experienceGaps: data.experienceGaps,
      positioningOptions: data.positioningOptions,
      sourceContext: data.sourceContext,
      generatedAt: data.generatedAt,
      updatedAt: data.updatedAt,
    }
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
      source: input.source,
      sourceType: input.sourceType,
      date: input.date ?? null,
      confidence: input.confidence ?? 0.0000,
      verificationStatus: input.verificationStatus ?? "UNKNOWN",
      relatedRole: input.relatedRole ?? "",
      relatedSkill: input.relatedSkill ?? "",
      relatedAchievement: input.relatedAchievement ?? "",
      metadata: input.metadata ?? {},
      createdAt: new Date(),
    })
    .returning()

  return {
    id: row.id,
    userId: row.userId,
    claim: row.claim,
    source: row.source,
    sourceType: row.sourceType,
    date: row.date,
    confidence: Number(row.confidence),
    verificationStatus: row.verificationStatus,
    relatedRole: row.relatedRole,
    relatedSkill: row.relatedSkill,
    relatedAchievement: row.relatedAchievement,
    metadata: row.metadata,
    createdAt: row.createdAt,
  }
}

export async function getMasterResume(userId: string): Promise<MasterResume | null> {
  const rows = await db.select().from(masterResumes).where(eq(masterResumes.userId, userId)).limit(1)
  return rows.length > 0 ? rows[0] : null
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
      .returning()

    return {
      id: row.id,
      userId: row.userId,
      title: row.title,
      content: row.content,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
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
      .returning()

    return {
      id: row.id,
      userId: row.userId,
      title: row.title,
      content: row.content,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}

export async function getResumeVersions(
  userId: string
): Promise<Array<{
  id: string
  versionNumber: number
  template: string
  content: Record<string, any>
  createdAt: Date
}>> {
  const rows = await db
    .select()
    .from(resumeVersions)
    .where(eq(resumeVersions.masterResumeId, userId ?? ""))
    .orderBy(asc(resumeVersions.versionNumber))

  return rows.map((row) => ({
    id: row.id,
    versionNumber: row.versionNumber,
    template: row.template,
    content: row.content,
    createdAt: row.createdAt,
  }))
}