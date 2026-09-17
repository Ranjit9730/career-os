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