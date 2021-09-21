import { Placeholder } from "semantic-ui-react";
import React from "react";

const SimplePlaceholder: React.FC = () => {
    return (
        <Placeholder>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
        </Placeholder>
    );
};

export default SimplePlaceholder;
