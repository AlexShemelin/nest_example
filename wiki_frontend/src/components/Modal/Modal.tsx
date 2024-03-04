import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';

export function ModalWindow({
  content,
  buttonName,
  modalName,
}: {
  content: React.ReactElement;
  buttonName: string;
  modalName: string;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal size="sm" opened={opened} onClose={close} title={modalName}>
        {content}
      </Modal>
      <Button onClick={open}>{buttonName}</Button>
    </>
  );
}
