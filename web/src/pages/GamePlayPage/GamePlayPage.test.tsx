import { render } from '@redwoodjs/testing/web'

import GamePlayPage from './GamePlayPage'

describe('GamePlayPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<GamePlayPage />)
    }).not.toThrow()
  })
})
