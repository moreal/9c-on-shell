import React from 'react';
import { Text, Box } from 'ink';
import { AvatarStateType } from '../generated/graphql';

export interface AvatarViewProps {
    avatarState: Pick<AvatarStateType, "name" | "exp" | "level">;
}

export const AvatarView: React.FC<AvatarViewProps> = ({ avatarState }) => {
    return <Box key={avatarState.name} borderStyle={"single"}>
        <Text>
            {avatarState.name} Lv. {avatarState.level} (exp: {avatarState.exp})
        </Text>
    </Box>
}
