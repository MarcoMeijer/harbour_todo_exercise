'use client';

import Link from 'next/link';
import classNames from 'classnames';
import { CreateList } from '@/components/CreateList';
import { randomColor } from '@/utils/randomColor';
import { useState } from 'react';
import { gql } from 'graphql-request';
import { client } from '@/lib/client';
import { Close } from './icons/Close';

export type TodoList = {
  id: number;
  created_at: string;
  name: string;
  email: string;
};

type MyListsProps = {
  list: TodoList[];
};

const DELETE_LIST_MUTATION = gql`
  mutation Mutation($deleteListId: Int!) {
    deleteList(id: $deleteListId)
  }
`;

export const MyLists = ({ list = [] }: MyListsProps) => {
  const [todoLists, setTodoLists] = useState<TodoList[]>(list);

  const onCreateHandler = (newTodoList: TodoList) => {
    setTodoLists([...todoLists, newTodoList]);
  };

  const onDeletedHandler = async (deleteListId: number) => {
    await client.request(DELETE_LIST_MUTATION, {
      deleteListId,
    });

    setTodoLists(todoLists.filter((list) => list.id !== deleteListId));
  };

  return (
    <div className="flex flex-col gap-8 text-center">
      <h1 className="text-4xl">
        {todoLists.length > 0 ? 'My TODO lists' : 'No lists yet!'}
      </h1>
      <ul>
        {todoLists.map((item) => (
          <li key={item.id} className="flex row ">
            <Link
              href={item.id.toString()}
              className={classNames(
                'py-2 pl-4 pr-2 bg-gray-900 rounded-lg mb-4 flex flex-1 justify-between items-center min-h-16 text-black hover:scale-[1.02] transform transition duration-300 ease-in-out',
                randomColor(),
              )}
            >
              {item.name}
            </Link>
            <button
              className="btn btn-square btn-error"
              onClick={() => onDeletedHandler(item.id)}
            >
              <Close />
            </button>
          </li>
        ))}
      </ul>
      <CreateList onCreate={onCreateHandler} />
    </div>
  );
};
