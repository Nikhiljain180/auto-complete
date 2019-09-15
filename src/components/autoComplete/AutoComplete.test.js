import React from 'react';
import ReactDOM, {render} from 'react-dom';
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-15';
import TestRenderer from 'react-test-renderer';

import AutoComplete from './AutoComplete';

Enzyme.configure({adapter: new Adapter()});

describe('auto complete', () => {

    test('renders without crashing', () => {
        const div = document.createElement('div');
        render(<AutoComplete maxAllowedSearch={5}/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('auto complete input field is existed', () => {

        const testRenderer = TestRenderer.create(<AutoComplete maxAllowedSearch={5}/>);
        const testInstance = testRenderer.root;
        expect(testInstance.findByProps({className: "searchField"}).type).toEqual('input');
    });

});
