'use client';

import { useState } from 'react';
import { Heart } from '@/components/icons/Heart';
import { Close } from '@/components/icons/Close';
import { AddTodo } from '@/components/AddTodo';
import { gql } from 'graphql-request';
import { client } from '@/lib/client';
import dragList from '@/utils/dragList';

export type Todo = {
  id: number;
  desc: string;
  finished: boolean;
};

type TodosProps = {
  listId: number;
  list: Todo[];
};

const ADD_TODO = gql`
  mutation AddTODO($addTodoListId: Int!, $desc: String!) {
    addTODO(listId: $addTodoListId, desc: $desc) {
      todo_list_id
      desc
      id
    }
  }
`;

const REMOVE_TODO = gql`
  mutation RemoveTODO($removeTodoId: Int!, $listId: Int!) {
    removeTODO(id: $removeTodoId, listId: $listId)
  }
`;

const FINISH_TODO = gql`
  mutation FinishTODO($finishTodoId: Int!, $listId: Int!) {
    finishTODO(id: $finishTodoId, listId: $listId) {
      desc
      id
      finished
    }
  }
`;

export const Todos = ({ list = [], listId }: TodosProps) => {
  const [todos, setTodos] = useState<Todo[]>(list);
  const [dragBegin, setDragBegin] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);

  const onAddHandler = async (desc: string) => {
    const res = await client.request<{ addTODO: Todo }>(ADD_TODO, {
      addTodoListId: listId,
      desc,
    });
    setTodos([...todos, res.addTODO]);
  };

  const onRemoveHandler = async (removeTodoId: number) => {
    await client.request<boolean>(REMOVE_TODO, {
      listId,
      removeTodoId,
    });
    setTodos(todos.filter((todo) => todo.id !== removeTodoId));
  };

  const onFinishHandler = async (finishTodoId: number) => {
    const res = await client.request<{ finishTODO: Todo }>(FINISH_TODO, {
      listId,
      finishTodoId,
    });
    setTodos(
      todos.map((todo) => (todo.id === finishTodoId ? res.finishTODO : todo)),
    );
  };

  const onDragStart = (index: number) => {
    setDragBegin(index);
    setDragEnd(index);
  };

  const onDragEnd = async () => {
    if (dragBegin === null || dragEnd === null) {
      return;
    }

    setTodos(dragList(todos, dragBegin, dragEnd));

    setDragBegin(null);
    setDragEnd(null);
  };

  const onDragEnter = (index: number) => {
    setDragEnd(index);
  };

  return (
    <div>
      <h2 className="text-center text-5xl mb-10">My TODO list</h2>
      <ul>
        {todos.map((item, i) => (
          <li
            key={item.id}
            className={`py-2 pl-4 pr-2 bg-gray-900 rounded-lg mb-4 flex justify-between items-center min-h-16
            ${i === dragBegin && dragBegin !== dragEnd ? 'opacity-0' : ''}
            ${dragBegin !== null && 'transition-all'}
            ${
              dragBegin !== null &&
              dragEnd !== null &&
              dragBegin < i &&
              i <= dragEnd
                ? '-translate-y-20'
                : ''
            }
            ${
              dragBegin !== null &&
              dragEnd !== null &&
              dragEnd <= i &&
              i < dragBegin
                ? 'translate-y-20'
                : ''
            }
            `}
            draggable={true}
            onDragStart={() => onDragStart(i)}
            onDragEnd={() => onDragEnd()}
            onDragEnter={() => onDragEnter(i)}
          >
            <p className={item.finished ? 'line-through' : 'text-white'}>
              {item.desc}
            </p>
            {!item.finished && (
              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-accent"
                  onClick={() => onFinishHandler(item.id)}
                >
                  <Heart />
                </button>
                <button
                  className="btn btn-square btn-error"
                  onClick={() => onRemoveHandler(item.id)}
                >
                  <Close />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <AddTodo onAdd={onAddHandler} />
    </div>
  );
};
