import React, { useState } from 'react';
import { render } from 'ink';
import TextInput from 'ink-text-input';
import { ApolloClient, ApolloProvider, HttpLink, ApolloLink, InMemoryCache } from '@apollo/client';
import { fetch } from "cross-fetch";
import { AgentView } from './views/agent';

const client = new ApolloClient({
    link: ApolloLink.from([
        new HttpLink({
            uri: "http://9c-main-full-state.planetarium.dev/graphql",
            fetch: fetch,
        })
    ]),
    cache: new InMemoryCache(),
});

function isAddress(str: string): boolean {
    return str.startsWith("0x") && str.length === 42;
}

const Command = () => {
    const [address, setAddress] = useState<string>("");

    return isAddress(address)
        ? <AgentView address={address} />
        : <TextInput value={address} onChange={setAddress} placeholder={"Address"} />;
};

const Root = () => {
    return (
        <ApolloProvider client={client}>
            <Command />
        </ApolloProvider>
    )
}

render(<Root />);
