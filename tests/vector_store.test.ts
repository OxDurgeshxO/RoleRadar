import test from "node:test";
import assert from "node:assert";
import { InMemoryVectorStore } from "../src/lib/vector-store.js";

test("InMemoryVectorStore and Prerequisite DAG Suite", async (t) => {
  const store = new InMemoryVectorStore();

  await t.test("Cosine similarity calculation", () => {
    const v1 = new Float32Array([1, 0, 0]);
    const v2 = new Float32Array([1, 0, 0]);
    const v3 = new Float32Array([0, 1, 0]);

    const simIdentical = InMemoryVectorStore.cosineSimilarity(v1, v2);
    assert.strictEqual(simIdentical, 1);

    const simOrthogonal = InMemoryVectorStore.cosineSimilarity(v1, v3);
    assert.strictEqual(simOrthogonal, 0);
  });

  await t.test("Vector top-k similarity search", () => {
    store.add({
      id: "role_1",
      roleName: "AI Systems Engineer",
      embedding: new Float32Array([0.9, 0.4, 0.1]),
    });
    store.add({
      id: "role_2",
      roleName: "Frontend Craft Architect",
      embedding: new Float32Array([0.1, 0.2, 0.95]),
    });

    const query = new Float32Array([0.85, 0.35, 0.12]);
    const results = store.search(query, 1);

    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].roleName, "AI Systems Engineer");
    assert.strictEqual(results[0].similarity > 0.95, true);
  });

  await t.test("Topological prerequisite DAG ordering", () => {
    const missing = ["Next.js", "Kubernetes"];
    const plan = InMemoryVectorStore.computePrerequisitePath(missing);

    const skillNames = plan.map((p) => p.skill);
    // React and JavaScript must appear before Next.js
    const jsIndex = skillNames.indexOf("JavaScript");
    const reactIndex = skillNames.indexOf("React");
    const nextIndex = skillNames.indexOf("Next.js");

    assert.strictEqual(jsIndex !== -1 && jsIndex < reactIndex, true);
    assert.strictEqual(reactIndex < nextIndex, true);

    // Docker must appear before Kubernetes
    const dockerIndex = skillNames.indexOf("Docker");
    const k8sIndex = skillNames.indexOf("Kubernetes");
    assert.strictEqual(dockerIndex !== -1 && dockerIndex < k8sIndex, true);
  });
});
