import { Table, Group, Text, ActionIcon, rem } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { IArticle, IUser } from '../../types/core.types';
import { FormBuilder } from '../FormBuilder/FormBuilder';
import { ModalWindow } from '../Modal/Modal';
import { editUserFields, editArticleFields } from '../../types/form.types';
import {
  handleSubmitEditUser,
  handleSubmitEditArticle,
  handleDeleteUser,
  handleDeleteArticle,
} from '../../store/userActions';

interface ArticleListProps<T> {
  data: T[];
}

export function ArticleList<T extends IUser | IArticle>({ data }: ArticleListProps<T>) {
  const title = data && data[0] && 'username' in data[0] ? 'Name' : 'Title';
  const rows = data.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Group gap="sm">
          <Text fz="sm" fw={500}>
            {item.id}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="sm">
          <Text fz="sm" fw={500}>
            {item && 'username' in item ? item.username : item.title}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <div style={{ margin: '5px' }}>
            <ModalWindow
              modalName={item && 'username' in item ? 'Edit user' : 'Edit article'}
              buttonName="edit"
              content={
                <FormBuilder
                  array={
                    item && 'username' in item
                      ? editUserFields(item.id)
                      : editArticleFields(item.id)
                  }
                  onSubmit={(submittedData: Record<string, string>) => {
                    item && 'username' in item
                      ? handleSubmitEditUser({ ...submittedData, id: String(item.id) })
                      : handleSubmitEditArticle({ ...submittedData, id: String(item.id) });
                  }}
                />
              }
            />
          </div>
          <ActionIcon
            onClick={() =>
              item && 'username' in item
                ? handleDeleteUser(item.username)
                : handleDeleteArticle(item.id)
            }
            variant="subtle"
            color="red"
          >
            <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Id</Table.Th>
            <Table.Th>{title}</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
