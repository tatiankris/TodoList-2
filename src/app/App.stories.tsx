import React from "react";
import App from "./App";
import {BrouserRouterDecorator, ReduxStoreProviderDecorator} from "../stories/ReduxStoreProviderDecorator";
import {Meta, Story} from "@storybook/react";

export default  {
    title: "App Component",
    component: App,
    decorators: [ReduxStoreProviderDecorator]
} as Meta;

// const Template: Story = () => <App demo={true}/>;

// export const AppExample = Template.bind({});

export const AppBaseExample = (props: any) => {
    return (<App demo={true} />)
}