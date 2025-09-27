import { Anchor, Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Привет,{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Арина!
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Здесь будет вся топовая инфа по буддизму (и не только). По всем вопросам обращайся{' '}
        <Anchor href="https://t.me/Millk04Arinka" size="lg">
          к моей ассистентке.
        </Anchor>
      </Text>
    </>
  );
}
