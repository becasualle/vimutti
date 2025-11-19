import Link from 'next/link';
import { Anchor, Center, Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Center h="100vh" style={{ flexDirection: 'column', marginTop: '-5%' }}>
        <Title className={classes.title} ta="center" mt={100}>
          Путь к{' '}
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{ from: 'red', to: 'blue', deg: 50 }}
          >
            освобождению
          </Text>
        </Title>
        <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
          Обретите эмоциональный покой и свободу благодаря проверенным инструментам психологии,
          философии и буддизма. Начните с{' '}
          <Anchor href="magazine/buddhism/four-noble-truths" size="lg" component={Link}>
            четырёх благородных истин{' '}
          </Anchor>
          или{' '}
          <Anchor href="/magazine/stoicism/doc" size="lg" component={Link}>
            дихотомии контроля.
          </Anchor>
        </Text>
      </Center>
    </>
  );
}
