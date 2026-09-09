import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Logo from '../logo';

type CardWrapperProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footerChildren?: React.ReactNode;
};

export default function CardWrapper({
  title,
  description,
  children,
  footerChildren,
}: CardWrapperProps) {
  return (
    <div className="w-full flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-8">
      <Logo />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footerChildren && <CardFooter>{footerChildren}</CardFooter>}
      </Card>
    </div>
  );
}
