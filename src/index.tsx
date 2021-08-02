import React, { useEffect, useState } from 'react';
import { render, Text, Newline, Spacer, Box } from 'ink';
import TextInput from 'ink-text-input';
import { AvatarStateType, useGetAgentAndAvatarSumarriesQuery } from "./generated/graphql"
import { ApolloClient, ApolloProvider, HttpLink, ApolloLink, InMemoryCache } from '@apollo/client';
import { fetch } from "cross-fetch";

const client = new ApolloClient({
    link: ApolloLink.from([
        new HttpLink({
            uri: "http://localhost/graphql",
            fetch: fetch,
        })
    ]),
    cache: new InMemoryCache(),
});

function isAddress(str: string): boolean {
    return str.startsWith("0x") && str.length === 42;
}

interface AgentViewProps {
    address: string;
}

interface AvatarViewProps {
    avatarState: Pick<AvatarStateType, "name" | "exp" | "level">;
}

const AvatarView: React.FC<AvatarViewProps> = ({ avatarState }) => {
    return <Box key={avatarState.name} borderStyle={"single"}>
        <Text>
            {avatarState.name} Lv. {avatarState.level} (exp: {avatarState.exp})
        </Text>
    </Box>
}

const AgentView: React.FC<AgentViewProps> = ({ address }) => {
    const { loading, data, refetch } = useGetAgentAndAvatarSumarriesQuery({
        variables: {
            address: address
        },
    });

    useEffect(() => {
        setInterval(() => {
            refetch();
        }, 100);
    });

    if (loading) {
        return <Text>Loading...</Text>
    }

    const agent = data?.stateQuery.agent;
    if (agent === undefined || agent === null) {
        return <Text>The agent({address}) seems not existed.</Text>
    }

    const avatarStates = agent.avatarStates ?? [];

    return <Box borderStyle={"round"} flexDirection={"column"}>
        <Text>
            Address: {agent.address}<Newline />
            Gold: {agent.gold}<Newline />
            Monster Collection Round: {agent.monsterCollectionRound}<Newline />
            Monster Collection Level: {agent.monsterCollectionLevel}<Newline />
        </Text>
        <Box flexDirection={"column"}>
            <Text>
                Avatars
            </Text>
            {avatarStates.map(avatarState => <AvatarView avatarState={avatarState} key={avatarState.name} />)}
        </Box>
    </Box >
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
