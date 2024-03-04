import { useForm } from '@mantine/form';
import { TextInput, Button, Group, Box } from '@mantine/core';

interface IFormArray {
  array: { name: string; initialValue: string }[];
  onSubmit: (data: Record<string, string>) => void;
}

export function FormBuilder({ array, onSubmit }: IFormArray) {
  const form = useForm({
    initialValues: array.reduce((acc, { name, initialValue }) => {
      //@ts-expect-error
      acc[name] = initialValue;
      return acc;
    }, {}),
  });

  return (
    <Box maw={340} mx="auto">
      {array.map(({ name }) => (
        <TextInput key={name} label={name} placeholder={name} {...form.getInputProps(name)} />
      ))}
      <Group justify="center" mt="xl">
        <Button onClick={() => onSubmit(form.values)}>Submit</Button>
      </Group>
    </Box>
  );
}
