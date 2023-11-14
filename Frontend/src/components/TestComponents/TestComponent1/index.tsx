import React from 'react'
import PropTypes from 'prop-types'

// This is test component.
// It can be deleted!!

const TestComponent1: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div data-testid='test-component1'>
      <span>Test Component1</span>
      {children}
    </div>
  )
}

TestComponent1.propTypes = {
  children: PropTypes.node,
}

export default TestComponent1
