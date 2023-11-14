/**
 * @jest-environment jsdom
 */

// This is an integration test example. All component tests should have .tsx extension to prevent errors from typescript compiler.
// To learn more about react testing library visit https://github.com/testing-library/jest-dom/#tocontainelement, https://testing-library.com/docs/react-testing-library/intro/

import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import TestComponent1 from '../../components/TestComponents/TestComponent1'
import TestComponent2 from '../../components/TestComponents/TestComponent2'

describe('Integration Test: Example test, testing if two components are rendering normally', () => {
    test('Should render the TestComponent2 in TestComponent1 respectfully.', () => {
        const component = (
            <TestComponent1>
                <TestComponent2 />
            </TestComponent1>
        )

        const { getByTestId } = render(component)
        const testElement1 = getByTestId('test-component1')
        const testElement2 = getByTestId('test-component2')

        expect(testElement1).toContainElement(testElement2)
    })
})

export {}
