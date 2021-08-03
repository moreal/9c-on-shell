import React, { useEffect } from 'react';
import { Text, Newline, Box } from 'ink';
import { useGetAgentAndAvatarSumarriesQuery } from "../generated/graphql"
import { AvatarView } from './avatar';

export interface AgentViewProps {
    address: string;
}

export const AgentView: React.FC<AgentViewProps> = ({ address }) => {
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
