// Role-specific interview preparation questions, generated deterministically
// from a role's strongest and weakest skill signals. Pure, client-safe.

export function generateInterviewPrep(
  roleName: string,
  present: string[],
  missing: string[],
): string[] {
  const questions: string[] = [];

  if (present[0]) {
    questions.push(`Walk me through a project where you used ${present[0]} — what was the measurable outcome?`);
  } else {
    questions.push("Which of your projects are you proudest of, and what was your specific contribution?");
  }
  if (present[1]) {
    questions.push(`How did you learn ${present[1]}, and how do you keep your knowledge of it current?`);
  }
  if (missing[0]) {
    questions.push(`${roleName} teams routinely use ${missing[0]}. How would you get productive with it in your first month?`);
  }
  if (missing[1]) {
    questions.push(`Tell me about a time you had to learn a tool like ${missing[1]} quickly. What was your approach?`);
  }
  questions.push("Which project on your resume best shows real-world impact, and how would you quantify it?");
  questions.push(`Where do you see the ${roleName} role evolving in the next two years, and how are you preparing?`);

  return questions.slice(0, 5);
}
