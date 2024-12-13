import { Card, CardBody, Skeleton } from "@yamada-ui/react";

export const CardSkeleton = () => {
  return (
    <Card>
      <CardBody>
        <Skeleton lineClamp={2} h={15} borderRadius="md" />
      </CardBody>
    </Card>
  );
};
