import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'ts-jest/utils'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';

jest.mock('next-auth/client')

jest.mock('next/router')

describe('SubscribeButton component', () => {

  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null,false]);
    render(
      <SubscribeButton />
    )
    
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  })

  it('should redirect user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null,false]);

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled();
  })

  it('should redirect to posts when user already has subscription',() => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMocked = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
        name: 'John Doe', 
        email: 'john.doe@example.com'
      }, 
        activeSubscription: {
          subscription_by_status: 'active'
        },
        expires: 'fake-expire'}
      , false]);

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(pushMocked).toHaveBeenCalledWith('/posts')
  })
})