import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-warning/10 border border-warning/30 rounded-lg px-3 py-2 flex items-start gap-2 text-xs text-warning">
      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
      <span>This tool supports clinical decision-making and does not replace physician judgment.</span>
    </div>
  );
}
