import { GOOD_CONDITIONS, BAD_CONDITIONS, CONDITION } from "@/enums/conditions";

export const getConditionSeverity = (condition: string): CONDITION => {
  const c = condition.toUpperCase();
  if (GOOD_CONDITIONS.includes(c)) return CONDITION.GOOD;
  if (BAD_CONDITIONS.includes(c)) return CONDITION.BAD;
  return CONDITION.MEDIUM;
};
