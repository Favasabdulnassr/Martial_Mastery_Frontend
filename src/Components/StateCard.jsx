import { Card, CardContent } from "./ui/card";

export const StatCard = ({ title, value, icon }) => (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className="p-2 bg-blue-100 rounded-full mr-4">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );