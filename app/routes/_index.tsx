import { defer } from "@remix-run/node";
import {
  Await,
  useAsyncError,
  useAsyncValue,
  useLoaderData,
} from "@remix-run/react";
import { Suspense } from "react";

export function loader() {
  const rejectingPromise = new Promise<void>((_, reject) => reject(null));

  return defer({ rejectingPromise });
}

export function ErrorBoundary() {
  return <h1>I am a server error</h1>;
}

export default function Index() {
  const { rejectingPromise } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<SkeletonComponent />}>
      <Await resolve={rejectingPromise} errorElement={<RejectedComponent />}>
        <ResolvedComponent />
      </Await>
    </Suspense>
  );
}

function ResolvedComponent() {
  const data = useAsyncValue();
  console.log(data);

  return <h1>I will never render...</h1>;
}

function RejectedComponent() {
  const error = useAsyncError();
  console.log(error);

  return <h1>I will always render!</h1>;
}

function SkeletonComponent() {
  return <span>loading...</span>;
}
