import React from "react";
import App from "./App";
import {ReduxStoreProviderDecorator} from "./stories/ReduxStoreProviderDecorator";
import {Meta, Story} from "@storybook/react";



export default  {
    title: "App Component",
    component: App,
    decorators: [ReduxStoreProviderDecorator],
} as Meta;

const Template: Story = () => <App />;

export const AppExample = Template.bind({});