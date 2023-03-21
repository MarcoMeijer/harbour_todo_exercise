import { Todo, Todos } from '@/components/Todos';
import { client } from '@/lib/client';
import { gql } from 'graphql-request';

type MyListPageMetadata = {
  params: { listId: string };
};

export async function generateMetadata({ params }: MyListPageMetadata) {
  return {
    title: `TODO List ${params.listId}`,
  };
}

type MyListPageProps = MyListPageMetadata;

const GET_TODOS = gql`
  query GetTODOs($listId: Int!) {
    getTODOs(listId: $listId) {
      desc
      finished
      id
    }
  }
`;

export default async function MyListPage({
  params: { listId },
}: MyListPageProps) {
  const res = await client.request<{ getTODOs: Todo[] }>(GET_TODOS, {
    listId: Number(listId),
  });

  return (
    <div className="flex align-center justify-center p-16 sm:p-8">
      <Todos listId={parseInt(listId)} list={res.getTODOs} />
    </div>
  );
}
