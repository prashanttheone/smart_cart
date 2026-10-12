import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from '../src/store';
import { Text } from '../src/components/ui/Text';
import { Badge } from '../src/components/ui/Badge';
import { IconButton } from '../src/components/ui/IconButton';
import { HomeHeader } from '../src/components/HomeHeader';
import { HomeSearchBar } from '../src/components/HomeSearchBar';

describe('UI & Home Components with ReactTestRenderer', () => {
  it('renders Text component with variants', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <Text variant="h1" weight="bold">
          SmartCart
        </Text>
      );
    });
    expect(renderer?.toJSON()).toBeTruthy();
  });

  it('renders Badge with count and dot', async () => {
    let countBadge: ReactTestRenderer.ReactTestRenderer | undefined;
    let dotBadge: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      countBadge = ReactTestRenderer.create(<Badge count={3} variant="danger" />);
      dotBadge = ReactTestRenderer.create(<Badge dot variant="primary" />);
    });

    expect(countBadge?.toJSON()).toBeTruthy();
    expect(dotBadge?.toJSON()).toBeTruthy();
  });

  it('renders IconButton with badge and press handler', async () => {
    const onPress = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <IconButton
          icon={<Text>Icon</Text>}
          onPress={onPress}
          badgeCount={2}
          accessibilityLabel="Notification Button"
        />
      );
    });

    expect(renderer?.toJSON()).toBeTruthy();
  });

  it('renders HomeHeader within providers', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <Provider store={store}>
          <NavigationContainer>
            <HomeHeader
              locationType="Home"
              addressText="Bangalore, 560001"
              cartCount={3}
              hasUnreadNotifications={true}
            />
          </NavigationContainer>
        </Provider>
      );
    });

    expect(renderer?.toJSON()).toBeTruthy();
  });

  it('renders HomeSearchBar with search and scan triggers', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
    const onChangeText = jest.fn();
    const onDebouncedSearch = jest.fn();

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <HomeSearchBar
          placeholder="Search products, brands..."
          onChangeText={onChangeText}
          onDebouncedSearch={onDebouncedSearch}
          rightActionType="scan"
        />
      );
    });

    expect(renderer?.toJSON()).toBeTruthy();
  });
});
