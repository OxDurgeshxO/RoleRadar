/**
 * vector-store.ts
 * In-memory vector database and skill prerequisite DAG engine for RoleRadar.
 * Supports dense cosine similarity vector search and topological skill path sequencing.
 */

export interface VectorDocument {
  id: string;
  roleName: string;
  embedding: Float32Array;
  metadata?: Record<string, any>;
}

export interface SimilarityResult {
  id: string;
  roleName: string;
  similarity: number;
  metadata?: Record<string, any>;
}

export const SKILL_PREREQUISITE_DAG: Record<string, string[]> = {
  "Kubernetes": ["Docker", "Linux Kernel & Networking"],
  "Docker": ["Linux CLI"],
  "Next.js": ["React", "TypeScript", "JavaScript"],
  "React": ["JavaScript", "HTML/CSS"],
  "TypeScript": ["JavaScript"],
  "PyTorch": ["Python", "Linear Algebra", "Calculus"],
  "TensorFlow": ["Python", "Linear Algebra"],
  "GraphQL": ["REST APIs", "Node.js"],
  "Microservices": ["Distributed Systems", "Docker", "gRPC"],
  "Kafka": ["Message Queues", "Distributed Systems"],
};

export class InMemoryVectorStore {
  private documents: VectorDocument[] = [];

  public add(doc: VectorDocument): void {
    this.documents.push(doc);
  }

  public addMany(docs: VectorDocument[]): void {
    this.documents.push(...docs);
  }

  public clear(): void {
    this.documents = [];
  }

  public size(): number {
    return this.documents.length;
  }

  /**
   * Computes exact cosine similarity:
   * sim(a, b) = (a · b) / (||a|| * ||b||)
   */
  public static cosineSimilarity(a: Float32Array, b: Float32Array): number {
    if (a.length !== b.length) return 0;

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) return 0;
    return Math.max(-1, Math.min(1, dot / denominator));
  }

  /**
   * Returns top-K nearest documents sorted by cosine similarity.
   */
  public search(queryVector: Float32Array, k: number = 5): SimilarityResult[] {
    const results: SimilarityResult[] = [];

    for (const doc of this.documents) {
      const sim = InMemoryVectorStore.cosineSimilarity(queryVector, doc.embedding);
      results.push({
        id: doc.id,
        roleName: doc.roleName,
        similarity: Math.round(sim * 10000) / 10000,
        metadata: doc.metadata,
      });
    }

    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, k);
  }

  /**
   * Resolves missing skills into an ordered learning DAG based on prerequisites.
   */
  public static computePrerequisitePath(missingSkills: string[]): {
    skill: string;
    prerequisites: string[];
    priorityOrder: number;
  }[] {
    const visited = new Set<string>();
    const ordered: { skill: string; prerequisites: string[]; priorityOrder: number }[] = [];

    function visit(skill: string) {
      if (visited.has(skill)) return;
      visited.add(skill);

      const prereqs = SKILL_PREREQUISITE_DAG[skill] ?? [];
      for (const p of prereqs) {
        visit(p);
      }

      ordered.push({
        skill,
        prerequisites: prereqs,
        priorityOrder: ordered.length + 1,
      });
    }

    for (const skill of missingSkills) {
      visit(skill);
    }

    return ordered;
  }
}
