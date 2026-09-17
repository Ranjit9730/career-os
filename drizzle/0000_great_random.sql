CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"metrics" jsonb DEFAULT '{}'::jsonb,
	"evidence_id" uuid,
	"verification_status" text DEFAULT 'UNKNOWN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"cache_key" text NOT NULL,
	"task_type" text NOT NULL,
	"input_hash" text NOT NULL,
	"model_version" text NOT NULL,
	"prompt_version" text NOT NULL,
	"result" jsonb NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_provider_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"encrypted_secret_reference" text NOT NULL,
	"status" text DEFAULT 'ENABLED' NOT NULL,
	"health" text DEFAULT 'UNKNOWN' NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"usage" jsonb DEFAULT '{}'::jsonb,
	"last_used" timestamp,
	"cooldown_until" timestamp,
	"error_count" integer DEFAULT 0 NOT NULL,
	"key_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"model" text NOT NULL,
	"status" text DEFAULT 'UNKNOWN' NOT NULL,
	"priority" integer DEFAULT 100 NOT NULL,
	"is_free" boolean DEFAULT false NOT NULL,
	"free_tier_verified_at" timestamp,
	"context_limit" integer,
	"capabilities" jsonb DEFAULT '{}'::jsonb,
	"fallback_provider_id" uuid,
	"enabled" boolean DEFAULT false NOT NULL,
	"free_only" boolean DEFAULT false NOT NULL,
	"request_count" integer DEFAULT 0 NOT NULL,
	"error_count" integer DEFAULT 0 NOT NULL,
	"cooldown_until" timestamp,
	"daily_usage" jsonb DEFAULT '{}'::jsonb,
	"monthly_usage" jsonb DEFAULT '{}'::jsonb,
	"last_used" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider_id" uuid,
	"provider_key_id" uuid,
	"task_type" text NOT NULL,
	"model" text NOT NULL,
	"free_only" boolean DEFAULT false NOT NULL,
	"status" text NOT NULL,
	"latency_ms" integer,
	"tokens_in" integer,
	"tokens_out" integer,
	"estimated_cost" numeric(12, 6),
	"error_code" text,
	"request_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"occurred_at" timestamp DEFAULT now() NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_id" uuid NOT NULL,
	"company_id" uuid,
	"application_date" timestamp,
	"source" text,
	"resume_version_id" uuid,
	"cover_letter_id" uuid,
	"status" text DEFAULT 'SAVED' NOT NULL,
	"interview_stage" text,
	"recruiter" text,
	"next_action" text,
	"follow_up_date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ats_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_id" uuid,
	"resume_version_id" uuid,
	"tailored_resume_id" uuid,
	"score" numeric(5, 2),
	"keyword_coverage" numeric(5, 2),
	"semantic_alignment" numeric(5, 2),
	"experience_alignment" numeric(5, 2),
	"title_alignment" numeric(5, 2),
	"formatting_checks" jsonb DEFAULT '{}'::jsonb,
	"analysis" jsonb DEFAULT '{}'::jsonb,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ats_keywords" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ats_analysis_id" uuid NOT NULL,
	"keyword" text NOT NULL,
	"category" text NOT NULL,
	"status" text NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"evidence_status" text DEFAULT 'UNKNOWN' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "boolean_queries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"query_type" text NOT NULL,
	"query" text NOT NULL,
	"titles" jsonb DEFAULT '[]'::jsonb,
	"aliases" jsonb DEFAULT '[]'::jsonb,
	"skills" jsonb DEFAULT '[]'::jsonb,
	"locations" jsonb DEFAULT '[]'::jsonb,
	"companies" jsonb DEFAULT '[]'::jsonb,
	"industries" jsonb DEFAULT '[]'::jsonb,
	"seniority" jsonb DEFAULT '[]'::jsonb,
	"saved" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "car_stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"challenge" text NOT NULL,
	"action" text NOT NULL,
	"result" text NOT NULL,
	"metrics" jsonb DEFAULT '{}'::jsonb,
	"skills" text[] DEFAULT '{}',
	"tools" text[] DEFAULT '{}',
	"role" text,
	"company_context" text,
	"evidence_id" uuid,
	"verification_status" text DEFAULT 'UNKNOWN' NOT NULL,
	"source" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "career_dna" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"career_identity" text,
	"core_strengths" jsonb DEFAULT '[]'::jsonb,
	"technical_strengths" jsonb DEFAULT '[]'::jsonb,
	"domain_strengths" jsonb DEFAULT '[]'::jsonb,
	"transferable_skills" jsonb DEFAULT '[]'::jsonb,
	"evidence_backed_achievements" jsonb DEFAULT '[]'::jsonb,
	"career_themes" jsonb DEFAULT '[]'::jsonb,
	"role_families" jsonb DEFAULT '[]'::jsonb,
	"potential_role_transitions" jsonb DEFAULT '[]'::jsonb,
	"skill_gaps" jsonb DEFAULT '[]'::jsonb,
	"experience_gaps" jsonb DEFAULT '[]'::jsonb,
	"positioning_options" jsonb DEFAULT '[]'::jsonb,
	"source_context" jsonb DEFAULT '{}'::jsonb,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "career_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"claim" text NOT NULL,
	"source" text,
	"source_type" text NOT NULL,
	"date" timestamp,
	"confidence" numeric(5, 4) DEFAULT '0.0000',
	"verification_status" text DEFAULT 'UNKNOWN' NOT NULL,
	"related_role" text,
	"related_skill" text,
	"related_achievement" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "career_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"full_name" text,
	"headline" text,
	"location" text,
	"work_mode" text,
	"salary_expectations" jsonb DEFAULT '{}'::jsonb,
	"career_goals" jsonb DEFAULT '{}'::jsonb,
	"preferred_roles" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"issuing_organization" text,
	"issued_date" timestamp,
	"expiration_date" timestamp,
	"credential_url" text,
	"verification_status" text DEFAULT 'UNKNOWN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"domain" text,
	"industry" text,
	"description" text,
	"locations" jsonb DEFAULT '[]'::jsonb,
	"career_pages" jsonb DEFAULT '[]'::jsonb,
	"website_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_intelligence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"claim" text NOT NULL,
	"source_url" text,
	"retrieved_at" timestamp DEFAULT now() NOT NULL,
	"source_type" text NOT NULL,
	"verification_status" text DEFAULT 'UNKNOWN' NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "company_people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"category" text NOT NULL,
	"relevance" text,
	"source_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"job_role_id" uuid NOT NULL,
	"is_target" boolean DEFAULT false NOT NULL,
	"rationale" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_calendar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"linkedin_content_id" uuid,
	"scheduled_for" timestamp NOT NULL,
	"status" text DEFAULT 'PLANNED' NOT NULL,
	"engagement" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_engagement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"linkedin_content_id" uuid NOT NULL,
	"metric" text NOT NULL,
	"value" numeric(12, 2) NOT NULL,
	"observed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_pillars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"evidence" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cover_letters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_id" uuid,
	"company_id" uuid,
	"application_id" uuid,
	"tone" text DEFAULT 'formal' NOT NULL,
	"content" text NOT NULL,
	"evidence_used" jsonb DEFAULT '[]'::jsonb,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"deadline" timestamp,
	"reason" text NOT NULL,
	"related_entity_type" text,
	"related_entity_id" uuid,
	"recommended_action" text NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"institution" text NOT NULL,
	"degree" text,
	"field_of_study" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"description" text,
	"verification_status" text DEFAULT 'UNKNOWN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "influencer_opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"source_url" text,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'DISCOVERED' NOT NULL,
	"related_content_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interview_question_id" uuid NOT NULL,
	"answer" text NOT NULL,
	"evidence" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interview_session_id" uuid NOT NULL,
	"dimension" text NOT NULL,
	"score" numeric(5, 2),
	"notes" text,
	"evidence" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interview_session_id" uuid NOT NULL,
	"category" text NOT NULL,
	"question" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_id" uuid,
	"job_role_id" uuid,
	"session_type" text NOT NULL,
	"status" text DEFAULT 'IN_PROGRESS' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"feedback" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "job_matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"job_role_id" uuid,
	"match_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role_family_id" uuid,
	"title" text NOT NULL,
	"seniority" text,
	"description" text,
	"skills" jsonb DEFAULT '[]'::jsonb,
	"tools" jsonb DEFAULT '[]'::jsonb,
	"domains" jsonb DEFAULT '[]'::jsonb,
	"responsibilities" jsonb DEFAULT '[]'::jsonb,
	"common_keywords" jsonb DEFAULT '[]'::jsonb,
	"transferable_skills" jsonb DEFAULT '[]'::jsonb,
	"experience_requirements" jsonb DEFAULT '{}'::jsonb,
	"career_transitions" jsonb DEFAULT '[]'::jsonb,
	"target_companies" jsonb DEFAULT '[]'::jsonb,
	"salary_research" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"dimension" text NOT NULL,
	"score" numeric(5, 2) NOT NULL,
	"reasons" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"snapshot" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"captured_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"source_type" text NOT NULL,
	"base_url" text,
	"authorized" boolean DEFAULT false NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"source_id" uuid,
	"company_id" uuid,
	"external_job_id" text,
	"title" text NOT NULL,
	"company_name" text NOT NULL,
	"location" text,
	"remote" boolean DEFAULT false NOT NULL,
	"salary_min" numeric(12, 2),
	"salary_max" numeric(12, 2),
	"currency" text DEFAULT 'USD',
	"employment_type" text,
	"description" text NOT NULL,
	"requirements" jsonb DEFAULT '{}'::jsonb,
	"skills" jsonb DEFAULT '[]'::jsonb,
	"source_url" text,
	"posted_date" timestamp,
	"closing_date" timestamp,
	"status" text DEFAULT 'NEW' NOT NULL,
	"canonical_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "linkedin_audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"linkedin_profile_id" uuid NOT NULL,
	"section" text NOT NULL,
	"current" text,
	"recommended" text,
	"reason" text,
	"evidence_used" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "linkedin_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"content_type" text NOT NULL,
	"text" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"published_at" timestamp,
	"evidence" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "linkedin_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"headline" text,
	"about" text,
	"experience" jsonb DEFAULT '[]'::jsonb,
	"skills" jsonb DEFAULT '[]'::jsonb,
	"target_role" text,
	"last_audit_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "master_resumes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text DEFAULT 'Master Resume' NOT NULL,
	"is_master" boolean DEFAULT true NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memory_exports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"format" text NOT NULL,
	"status" text DEFAULT 'QUEUED' NOT NULL,
	"file_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "negotiations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"application_id" uuid,
	"market_context" jsonb DEFAULT '{}'::jsonb,
	"compensation_components" jsonb DEFAULT '{}'::jsonb,
	"counteroffer_strategy" jsonb DEFAULT '{}'::jsonb,
	"counter_script" text,
	"pushback_simulation" jsonb DEFAULT '{}'::jsonb,
	"final_plan" jsonb DEFAULT '{}'::jsonb,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "network_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"person_id" uuid,
	"job_id" uuid,
	"company_id" uuid,
	"category" text NOT NULL,
	"relationship_type" text,
	"why_relevant" text,
	"source" text,
	"profile_url" text,
	"stage" text DEFAULT 'FOUND' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "network_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"occurred_at" timestamp DEFAULT now() NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "network_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"contact_id" uuid NOT NULL,
	"sequence_id" uuid,
	"stage" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"external_action_status" text DEFAULT 'AI_GENERATED' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"sent_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "network_relationships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid NOT NULL,
	"relationship_type" text NOT NULL,
	"status" text DEFAULT 'FOUND' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "network_sequences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"related_entity_type" text,
	"related_entity_id" uuid,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_id" uuid,
	"company_id" uuid,
	"application_id" uuid,
	"status" text DEFAULT 'DISCOVERED' NOT NULL,
	"next_action" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"title" text,
	"company_id" uuid,
	"profile_url" text,
	"categories" jsonb DEFAULT '[]'::jsonb,
	"source_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"outcome" text,
	"role" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"evidence_id" uuid,
	"verification_status" text DEFAULT 'UNKNOWN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recruitment_agencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"agency" text NOT NULL,
	"recruiter" text,
	"specialization" text,
	"roles" jsonb DEFAULT '[]'::jsonb,
	"location" text,
	"contact" jsonb DEFAULT '{}'::jsonb,
	"relationship_status" text DEFAULT 'NEW' NOT NULL,
	"last_contact" timestamp,
	"next_action" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "related_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"source_role_id" uuid NOT NULL,
	"target_role_id" uuid NOT NULL,
	"relation_type" text NOT NULL,
	"rationale" text,
	"evidence" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_version_id" uuid NOT NULL,
	"section_type" text NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"evidence_ids" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"master_resume_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"template" text DEFAULT 'standard' NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_families" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_keywords" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_role_id" uuid NOT NULL,
	"keyword" text NOT NULL,
	"category" text DEFAULT 'skill' NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_transitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"from_role_id" uuid NOT NULL,
	"to_role_id" uuid NOT NULL,
	"rationale" text,
	"evidence" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "salary_research" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"seniority" text,
	"location" text,
	"source_url" text NOT NULL,
	"retrieved_at" timestamp DEFAULT now() NOT NULL,
	"salary_min" numeric(12, 2),
	"salary_max" numeric(12, 2),
	"currency" text DEFAULT 'USD',
	"sample_size" integer,
	"methodology" text
);
--> statement-breakpoint
CREATE TABLE "search_matrices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_role_id" uuid,
	"matrix" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_evidence" (
	"skill_id" uuid NOT NULL,
	"evidence_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "skill_evidence_skill_id_evidence_id_pk" PRIMARY KEY("skill_id","evidence_id")
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"category" text DEFAULT 'general' NOT NULL,
	"proficiency" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_citations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"source_type" text NOT NULL,
	"url" text,
	"retrieved_at" timestamp DEFAULT now() NOT NULL,
	"claim" text NOT NULL,
	"related_entity_type" text NOT NULL,
	"related_entity_id" uuid,
	"verification_status" text DEFAULT 'UNKNOWN' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tailored_resumes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_id" uuid,
	"master_resume_id" uuid NOT NULL,
	"resume_version_id" uuid,
	"format" text DEFAULT 'standard' NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"changes" jsonb DEFAULT '{}'::jsonb,
	"added_keywords" jsonb DEFAULT '[]'::jsonb,
	"removed_content" jsonb DEFAULT '[]'::jsonb,
	"evidence_used" jsonb DEFAULT '[]'::jsonb,
	"potential_risks" jsonb DEFAULT '[]'::jsonb,
	"version_number" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "target_companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'TARGETING' NOT NULL,
	"notes" text,
	"networkability" text DEFAULT 'UNKNOWN',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"priority" text DEFAULT 'medium' NOT NULL,
	"deadline" timestamp,
	"related_entity_type" text,
	"related_entity_id" uuid,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "title_aliases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_role_id" uuid NOT NULL,
	"alias" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" text NOT NULL,
	"setup_completed" boolean DEFAULT false NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "win_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_id" uuid,
	"company_id" uuid,
	"company_problem" text,
	"evidence" jsonb DEFAULT '[]'::jsonb,
	"hypothesis" text,
	"proposed_solution" jsonb DEFAULT '{}'::jsonb,
	"implementation_plan" jsonb DEFAULT '{}'::jsonb,
	"metrics" jsonb DEFAULT '[]'::jsonb,
	"risks" jsonb DEFAULT '[]'::jsonb,
	"day_90_plan" jsonb DEFAULT '{}'::jsonb,
	"expected_impact" text,
	"why_candidate" text,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company" text NOT NULL,
	"title" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"current" boolean DEFAULT false NOT NULL,
	"location" text,
	"description" text,
	"achievements_json" jsonb DEFAULT '[]'::jsonb,
	"verification_status" text DEFAULT 'UNKNOWN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_evidence_id_career_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."career_evidence"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_cache" ADD CONSTRAINT "ai_cache_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_provider_keys" ADD CONSTRAINT "ai_provider_keys_provider_id_ai_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."ai_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_providers" ADD CONSTRAINT "ai_providers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_provider_id_ai_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."ai_providers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_provider_key_id_ai_provider_keys_id_fk" FOREIGN KEY ("provider_key_id") REFERENCES "public"."ai_provider_keys"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_events" ADD CONSTRAINT "application_events_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_resume_version_id_resume_versions_id_fk" FOREIGN KEY ("resume_version_id") REFERENCES "public"."resume_versions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ats_analyses" ADD CONSTRAINT "ats_analyses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ats_analyses" ADD CONSTRAINT "ats_analyses_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ats_analyses" ADD CONSTRAINT "ats_analyses_resume_version_id_resume_versions_id_fk" FOREIGN KEY ("resume_version_id") REFERENCES "public"."resume_versions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ats_analyses" ADD CONSTRAINT "ats_analyses_tailored_resume_id_tailored_resumes_id_fk" FOREIGN KEY ("tailored_resume_id") REFERENCES "public"."tailored_resumes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ats_keywords" ADD CONSTRAINT "ats_keywords_ats_analysis_id_ats_analyses_id_fk" FOREIGN KEY ("ats_analysis_id") REFERENCES "public"."ats_analyses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boolean_queries" ADD CONSTRAINT "boolean_queries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_stories" ADD CONSTRAINT "car_stories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_stories" ADD CONSTRAINT "car_stories_evidence_id_career_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."career_evidence"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_dna" ADD CONSTRAINT "career_dna_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_evidence" ADD CONSTRAINT "career_evidence_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_profiles" ADD CONSTRAINT "career_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_intelligence" ADD CONSTRAINT "company_intelligence_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_people" ADD CONSTRAINT "company_people_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_people" ADD CONSTRAINT "company_people_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_roles" ADD CONSTRAINT "company_roles_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_roles" ADD CONSTRAINT "company_roles_job_role_id_job_roles_id_fk" FOREIGN KEY ("job_role_id") REFERENCES "public"."job_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_calendar" ADD CONSTRAINT "content_calendar_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_calendar" ADD CONSTRAINT "content_calendar_linkedin_content_id_linkedin_content_id_fk" FOREIGN KEY ("linkedin_content_id") REFERENCES "public"."linkedin_content"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_engagement" ADD CONSTRAINT "content_engagement_linkedin_content_id_linkedin_content_id_fk" FOREIGN KEY ("linkedin_content_id") REFERENCES "public"."linkedin_content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_pillars" ADD CONSTRAINT "content_pillars_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_actions" ADD CONSTRAINT "daily_actions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "influencer_opportunities" ADD CONSTRAINT "influencer_opportunities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "influencer_opportunities" ADD CONSTRAINT "influencer_opportunities_related_content_id_linkedin_content_id_fk" FOREIGN KEY ("related_content_id") REFERENCES "public"."linkedin_content"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_answers" ADD CONSTRAINT "interview_answers_interview_question_id_interview_questions_id_fk" FOREIGN KEY ("interview_question_id") REFERENCES "public"."interview_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_feedback" ADD CONSTRAINT "interview_feedback_interview_session_id_interview_sessions_id_fk" FOREIGN KEY ("interview_session_id") REFERENCES "public"."interview_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_interview_session_id_interview_sessions_id_fk" FOREIGN KEY ("interview_session_id") REFERENCES "public"."interview_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_job_role_id_job_roles_id_fk" FOREIGN KEY ("job_role_id") REFERENCES "public"."job_roles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_matches" ADD CONSTRAINT "job_matches_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_matches" ADD CONSTRAINT "job_matches_job_role_id_job_roles_id_fk" FOREIGN KEY ("job_role_id") REFERENCES "public"."job_roles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_roles" ADD CONSTRAINT "job_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_roles" ADD CONSTRAINT "job_roles_role_family_id_role_families_id_fk" FOREIGN KEY ("role_family_id") REFERENCES "public"."role_families"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_scores" ADD CONSTRAINT "job_scores_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_snapshots" ADD CONSTRAINT "job_snapshots_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_sources" ADD CONSTRAINT "job_sources_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_source_id_job_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."job_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linkedin_audits" ADD CONSTRAINT "linkedin_audits_linkedin_profile_id_linkedin_profile_id_fk" FOREIGN KEY ("linkedin_profile_id") REFERENCES "public"."linkedin_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linkedin_content" ADD CONSTRAINT "linkedin_content_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linkedin_profile" ADD CONSTRAINT "linkedin_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "master_resumes" ADD CONSTRAINT "master_resumes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memory_exports" ADD CONSTRAINT "memory_exports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "negotiations" ADD CONSTRAINT "negotiations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "negotiations" ADD CONSTRAINT "negotiations_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_contacts" ADD CONSTRAINT "network_contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_contacts" ADD CONSTRAINT "network_contacts_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_contacts" ADD CONSTRAINT "network_contacts_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_contacts" ADD CONSTRAINT "network_contacts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_events" ADD CONSTRAINT "network_events_contact_id_network_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."network_contacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_messages" ADD CONSTRAINT "network_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_messages" ADD CONSTRAINT "network_messages_contact_id_network_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."network_contacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_messages" ADD CONSTRAINT "network_messages_sequence_id_network_sequences_id_fk" FOREIGN KEY ("sequence_id") REFERENCES "public"."network_sequences"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_relationships" ADD CONSTRAINT "network_relationships_contact_id_network_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."network_contacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_sequences" ADD CONSTRAINT "network_sequences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people" ADD CONSTRAINT "people_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people" ADD CONSTRAINT "people_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_evidence_id_career_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."career_evidence"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recruitment_agencies" ADD CONSTRAINT "recruitment_agencies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "related_roles" ADD CONSTRAINT "related_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "related_roles" ADD CONSTRAINT "related_roles_source_role_id_job_roles_id_fk" FOREIGN KEY ("source_role_id") REFERENCES "public"."job_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "related_roles" ADD CONSTRAINT "related_roles_target_role_id_job_roles_id_fk" FOREIGN KEY ("target_role_id") REFERENCES "public"."job_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_sections" ADD CONSTRAINT "resume_sections_resume_version_id_resume_versions_id_fk" FOREIGN KEY ("resume_version_id") REFERENCES "public"."resume_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_versions" ADD CONSTRAINT "resume_versions_master_resume_id_master_resumes_id_fk" FOREIGN KEY ("master_resume_id") REFERENCES "public"."master_resumes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_families" ADD CONSTRAINT "role_families_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_keywords" ADD CONSTRAINT "role_keywords_job_role_id_job_roles_id_fk" FOREIGN KEY ("job_role_id") REFERENCES "public"."job_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_transitions" ADD CONSTRAINT "role_transitions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_transitions" ADD CONSTRAINT "role_transitions_from_role_id_job_roles_id_fk" FOREIGN KEY ("from_role_id") REFERENCES "public"."job_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_transitions" ADD CONSTRAINT "role_transitions_to_role_id_job_roles_id_fk" FOREIGN KEY ("to_role_id") REFERENCES "public"."job_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary_research" ADD CONSTRAINT "salary_research_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_matrices" ADD CONSTRAINT "search_matrices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_matrices" ADD CONSTRAINT "search_matrices_job_role_id_job_roles_id_fk" FOREIGN KEY ("job_role_id") REFERENCES "public"."job_roles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_evidence" ADD CONSTRAINT "skill_evidence_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_evidence" ADD CONSTRAINT "skill_evidence_evidence_id_career_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."career_evidence"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_citations" ADD CONSTRAINT "source_citations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailored_resumes" ADD CONSTRAINT "tailored_resumes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailored_resumes" ADD CONSTRAINT "tailored_resumes_master_resume_id_master_resumes_id_fk" FOREIGN KEY ("master_resume_id") REFERENCES "public"."master_resumes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailored_resumes" ADD CONSTRAINT "tailored_resumes_resume_version_id_resume_versions_id_fk" FOREIGN KEY ("resume_version_id") REFERENCES "public"."resume_versions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "target_companies" ADD CONSTRAINT "target_companies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "target_companies" ADD CONSTRAINT "target_companies_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "title_aliases" ADD CONSTRAINT "title_aliases_job_role_id_job_roles_id_fk" FOREIGN KEY ("job_role_id") REFERENCES "public"."job_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "win_projects" ADD CONSTRAINT "win_projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "win_projects" ADD CONSTRAINT "win_projects_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "win_projects" ADD CONSTRAINT "win_projects_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_experience" ADD CONSTRAINT "work_experience_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "achievements_user_id_index" ON "achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "achievements_evidence_id_index" ON "achievements" USING btree ("evidence_id");--> statement-breakpoint
CREATE INDEX "ai_cache_user_id_index" ON "ai_cache" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_cache_cache_key_unique" ON "ai_cache" USING btree ("user_id","cache_key");--> statement-breakpoint
CREATE INDEX "ai_cache_input_hash_index" ON "ai_cache" USING btree ("input_hash");--> statement-breakpoint
CREATE INDEX "ai_provider_keys_provider_id_index" ON "ai_provider_keys" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "ai_provider_keys_status_index" ON "ai_provider_keys" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ai_providers_user_id_index" ON "ai_providers" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_providers_provider_model_unique" ON "ai_providers" USING btree ("user_id","provider","model");--> statement-breakpoint
CREATE INDEX "ai_providers_fallback_provider_id_index" ON "ai_providers" USING btree ("fallback_provider_id");--> statement-breakpoint
CREATE INDEX "ai_usage_user_id_index" ON "ai_usage" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_usage_provider_id_index" ON "ai_usage" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "ai_usage_created_at_index" ON "ai_usage" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "ai_usage_task_type_index" ON "ai_usage" USING btree ("task_type");--> statement-breakpoint
CREATE INDEX "application_events_application_id_index" ON "application_events" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "applications_user_id_index" ON "applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "applications_job_id_index" ON "applications" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "applications_company_id_index" ON "applications" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "applications_status_index" ON "applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ats_analyses_user_id_index" ON "ats_analyses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ats_analyses_job_id_index" ON "ats_analyses" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "ats_analyses_resume_version_id_index" ON "ats_analyses" USING btree ("resume_version_id");--> statement-breakpoint
CREATE INDEX "ats_keywords_ats_analysis_id_index" ON "ats_keywords" USING btree ("ats_analysis_id");--> statement-breakpoint
CREATE INDEX "audit_logs_user_id_index" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_index" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_type_index" ON "audit_logs" USING btree ("entity_type");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_sessions_token_hash_unique" ON "auth_sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "auth_sessions_user_id_index" ON "auth_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_sessions_expires_at_index" ON "auth_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "boolean_queries_user_id_index" ON "boolean_queries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "boolean_queries_query_type_index" ON "boolean_queries" USING btree ("query_type");--> statement-breakpoint
CREATE INDEX "car_stories_user_id_index" ON "car_stories" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "car_stories_evidence_id_index" ON "car_stories" USING btree ("evidence_id");--> statement-breakpoint
CREATE UNIQUE INDEX "career_dna_user_unique" ON "career_dna" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "career_evidence_user_id_index" ON "career_evidence" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "career_evidence_verification_status_index" ON "career_evidence" USING btree ("verification_status");--> statement-breakpoint
CREATE INDEX "career_evidence_related_role_index" ON "career_evidence" USING btree ("related_role");--> statement-breakpoint
CREATE UNIQUE INDEX "career_profiles_user_unique" ON "career_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "certifications_user_id_index" ON "certifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "companies_user_id_index" ON "companies" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "companies_domain_index" ON "companies" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "companies_name_index" ON "companies" USING btree ("name");--> statement-breakpoint
CREATE INDEX "company_intelligence_company_id_index" ON "company_intelligence" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "company_intelligence_retrieved_at_index" ON "company_intelligence" USING btree ("retrieved_at");--> statement-breakpoint
CREATE INDEX "company_people_company_id_index" ON "company_people" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "company_people_person_id_index" ON "company_people" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "company_roles_company_id_index" ON "company_roles" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "company_roles_job_role_id_index" ON "company_roles" USING btree ("job_role_id");--> statement-breakpoint
CREATE INDEX "content_calendar_user_id_index" ON "content_calendar" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "content_calendar_scheduled_for_index" ON "content_calendar" USING btree ("scheduled_for");--> statement-breakpoint
CREATE INDEX "content_engagement_content_id_index" ON "content_engagement" USING btree ("linkedin_content_id");--> statement-breakpoint
CREATE INDEX "content_pillars_user_id_index" ON "content_pillars" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cover_letters_user_id_index" ON "cover_letters" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cover_letters_job_id_index" ON "cover_letters" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "daily_actions_user_id_index" ON "daily_actions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "daily_actions_deadline_index" ON "daily_actions" USING btree ("deadline");--> statement-breakpoint
CREATE INDEX "education_user_id_index" ON "education" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "influencer_opportunities_user_id_index" ON "influencer_opportunities" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "interview_answers_question_id_index" ON "interview_answers" USING btree ("interview_question_id");--> statement-breakpoint
CREATE INDEX "interview_feedback_session_id_index" ON "interview_feedback" USING btree ("interview_session_id");--> statement-breakpoint
CREATE INDEX "interview_questions_session_id_index" ON "interview_questions" USING btree ("interview_session_id");--> statement-breakpoint
CREATE INDEX "interview_sessions_user_id_index" ON "interview_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "interview_sessions_job_id_index" ON "interview_sessions" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_matches_job_id_index" ON "job_matches" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_matches_job_role_id_index" ON "job_matches" USING btree ("job_role_id");--> statement-breakpoint
CREATE INDEX "job_roles_user_id_index" ON "job_roles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "job_roles_role_family_id_index" ON "job_roles" USING btree ("role_family_id");--> statement-breakpoint
CREATE INDEX "job_roles_title_index" ON "job_roles" USING btree ("title");--> statement-breakpoint
CREATE INDEX "job_scores_job_id_index" ON "job_scores" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_scores_dimension_index" ON "job_scores" USING btree ("dimension");--> statement-breakpoint
CREATE INDEX "job_snapshots_job_id_index" ON "job_snapshots" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_sources_user_id_index" ON "job_sources" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "jobs_user_id_index" ON "jobs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "jobs_source_id_index" ON "jobs" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "jobs_company_id_index" ON "jobs" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "jobs_external_job_id_index" ON "jobs" USING btree ("external_job_id");--> statement-breakpoint
CREATE UNIQUE INDEX "jobs_canonical_url_unique" ON "jobs" USING btree ("canonical_url");--> statement-breakpoint
CREATE INDEX "jobs_status_index" ON "jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "linkedin_audits_profile_id_index" ON "linkedin_audits" USING btree ("linkedin_profile_id");--> statement-breakpoint
CREATE INDEX "linkedin_content_user_id_index" ON "linkedin_content" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "linkedin_content_status_index" ON "linkedin_content" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "linkedin_profile_user_unique" ON "linkedin_profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "master_resumes_user_id_index" ON "master_resumes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "memory_exports_user_id_index" ON "memory_exports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "memory_exports_status_index" ON "memory_exports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "negotiations_user_id_index" ON "negotiations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "negotiations_application_id_index" ON "negotiations" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "network_contacts_user_id_index" ON "network_contacts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "network_contacts_person_id_index" ON "network_contacts" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "network_contacts_job_id_index" ON "network_contacts" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "network_contacts_company_id_index" ON "network_contacts" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "network_contacts_stage_index" ON "network_contacts" USING btree ("stage");--> statement-breakpoint
CREATE INDEX "network_events_contact_id_index" ON "network_events" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "network_messages_contact_id_index" ON "network_messages" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "network_messages_status_index" ON "network_messages" USING btree ("status");--> statement-breakpoint
CREATE INDEX "network_relationships_contact_id_index" ON "network_relationships" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "network_sequences_user_id_index" ON "network_sequences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_user_id_index" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_read_index" ON "notifications" USING btree ("read");--> statement-breakpoint
CREATE INDEX "opportunities_user_id_index" ON "opportunities" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "opportunities_job_id_index" ON "opportunities" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "opportunities_company_id_index" ON "opportunities" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "people_user_id_index" ON "people" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "people_company_id_index" ON "people" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "people_name_index" ON "people" USING btree ("name");--> statement-breakpoint
CREATE INDEX "projects_user_id_index" ON "projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "projects_evidence_id_index" ON "projects" USING btree ("evidence_id");--> statement-breakpoint
CREATE INDEX "recruitment_agencies_user_id_index" ON "recruitment_agencies" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "related_roles_source_target_unique" ON "related_roles" USING btree ("source_role_id","target_role_id","relation_type");--> statement-breakpoint
CREATE INDEX "related_roles_target_role_id_index" ON "related_roles" USING btree ("target_role_id");--> statement-breakpoint
CREATE UNIQUE INDEX "resume_sections_resume_order_unique" ON "resume_sections" USING btree ("resume_version_id","order_index");--> statement-breakpoint
CREATE UNIQUE INDEX "resume_versions_master_version_unique" ON "resume_versions" USING btree ("master_resume_id","version_number");--> statement-breakpoint
CREATE INDEX "role_families_user_id_index" ON "role_families" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "role_families_name_index" ON "role_families" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "role_keywords_job_role_keyword_unique" ON "role_keywords" USING btree ("job_role_id","keyword");--> statement-breakpoint
CREATE UNIQUE INDEX "role_transitions_from_to_unique" ON "role_transitions" USING btree ("from_role_id","to_role_id");--> statement-breakpoint
CREATE INDEX "salary_research_user_id_index" ON "salary_research" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "salary_research_role_index" ON "salary_research" USING btree ("role");--> statement-breakpoint
CREATE INDEX "search_matrices_user_id_index" ON "search_matrices" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "search_matrices_job_role_id_index" ON "search_matrices" USING btree ("job_role_id");--> statement-breakpoint
CREATE UNIQUE INDEX "settings_user_key_unique" ON "settings" USING btree ("user_id","key");--> statement-breakpoint
CREATE INDEX "skill_evidence_evidence_id_index" ON "skill_evidence" USING btree ("evidence_id");--> statement-breakpoint
CREATE INDEX "skills_user_id_index" ON "skills" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "skills_name_index" ON "skills" USING btree ("name");--> statement-breakpoint
CREATE INDEX "source_citations_user_id_index" ON "source_citations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "source_citations_related_entity_index" ON "source_citations" USING btree ("related_entity_type","related_entity_id");--> statement-breakpoint
CREATE INDEX "source_citations_retrieved_at_index" ON "source_citations" USING btree ("retrieved_at");--> statement-breakpoint
CREATE INDEX "tailored_resumes_user_id_index" ON "tailored_resumes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tailored_resumes_job_id_index" ON "tailored_resumes" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "tailored_resumes_master_resume_id_index" ON "tailored_resumes" USING btree ("master_resume_id");--> statement-breakpoint
CREATE INDEX "target_companies_user_id_index" ON "target_companies" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "target_companies_company_id_index" ON "target_companies" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "tasks_user_id_index" ON "tasks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tasks_status_index" ON "tasks" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "title_aliases_job_role_alias_unique" ON "title_aliases" USING btree ("job_role_id","alias");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "win_projects_user_id_index" ON "win_projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "win_projects_job_id_index" ON "win_projects" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "win_projects_company_id_index" ON "win_projects" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "work_experience_user_id_index" ON "work_experience" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "work_experience_company_index" ON "work_experience" USING btree ("company");