import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-lg font-semibold">Feature under construction</h3>
          <p className="text-muted-foreground">Stay tuned for updates!</p>
        </div>
      </CardContent>
    </Card>
  );
}
