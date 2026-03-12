import { CONDITION } from "@/enums/conditions";
import { getConditionSeverity } from "@/utils/severity";

interface ConditionChipProps {
  condition: string;
}

export default function ConditionChip({ condition }: ConditionChipProps) {
  const severity = getConditionSeverity(condition);

  const styles = {
    [CONDITION.GOOD]: "bg-emerald-100 text-emerald-700 border-emerald-200",
    [CONDITION.MEDIUM]: "bg-amber-100 text-amber-700 border-amber-200",
    [CONDITION.BAD]: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[severity]} whitespace-nowrap`}>
      {condition}
    </span>
  );
}
