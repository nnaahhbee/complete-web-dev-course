//provider - wrapper around the components that need access to the context

import React, { useState } from 'react';
import UserContext from './UserContext';

const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    return(
        // Provider that wraps the components needing access to the user context
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;