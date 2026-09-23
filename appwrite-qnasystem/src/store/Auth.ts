// Import Zustand's store creator and middleware used to update and save authentication state.
import {create} from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

// Import Appwrite types and the configured client-side account service.
import {AppwriteException, ID, Models} from "appwrite";
import { account } from "@/models/client/config";

// Describe the custom preferences stored for each user's Appwrite account.
export interface UserPrefs{
    reputation: number
}

// Describe the authentication data and actions that the Zustand store provides.
interface IAuthStore{
    session:  Models.Session | null;
    jwt: string | null
    user: Models.User<UserPrefs> | null
    hydrated: boolean

    setHydrated() : void;
    verifySession(): Promise<void>
    login(
        email: string,
        password: string
    ): Promise<
    {success: boolean; 
    error?: AppwriteException | null
    }>
    createAccount(
        name: string,
        email: string,
        password: string
    ): Promise<
    {success: boolean; 
    error?: AppwriteException | null
    }>
    logout(): Promise<void>
}

// Create a global authentication store and persist its state in browser storage.
export const useAuthStore = create<IAuthStore>()(
    persist(
        // Immer allows the store to update state with simple assignment-style code.
        immer((set) => ({
            // Store the current Appwrite session, JWT, user, and hydration status.
            session: null,
            jwt: null,
            user: null,
            hydrated: false,

            // Mark the store as ready after persisted state has been restored.
            setHydrated() {
                set({hydrated: true})
            },

            // Check Appwrite for the user's current session and save it in the store.
            async verifySession() {
                try {
                   const session = await account.getSession("current")
                   set({session})
                } catch (error) {
                    console.log(error)
                    
                }
            },

            // Sign in with an email and password, then load the user and a JWT.
            async login(email: string, password: string) {
                try {
                   // Create a session for the supplied credentials.
                   const session =  await account.createEmailPasswordSession(email, password)
                   // Load account data and create a token at the same time.
                   const [user, {jwt}] = await Promise.all([
                    account.get<UserPrefs>(),
                    account.createJWT()

                   ])
                   // Give new users an initial reputation value when they do not have one.
                   if(!user.prefs?.reputation) await account.updatePrefs<UserPrefs>({
                    reputation: 0
                   })

                   // Save the successful login information in the global store.
                   set({session, user, jwt})

                   return {success: true}

                } catch (error) {
                    console.log(error)
                    return {
                        success: false,
                        error: error instanceof AppwriteException ?
                        error: null,
                    }
                    
                }
                
            },

            // Create a new Appwrite account using the supplied profile information.
            async createAccount(name: string, email: string, password: string) {
                try {
                    // Generate a unique account ID and send the registration details to Appwrite.
                    await account.create(ID.unique(), email, password, name)
                    return {success: true}
                    
                } catch (error) {
                    console.log(error)
                    return {
                        success: false,
                        error: error instanceof AppwriteException ?
                        error: null,
                    }  
                }    
            },

            // End all active Appwrite sessions and clear local authentication data.
            async logout() {
                try {
                    // Delete the user's sessions from Appwrite.
                    await account.deleteSessions()
                    // Remove authentication information from the Zustand store.
                    set({session: null, jwt: null, user: null})
                } catch (error) {
                    console.log(error)
                }
            },
        })),
        {
            // Use "auth" as the browser-storage key for this persisted store.
            name: "auth",
            // Run after persisted authentication state has been loaded.
            onRehydrateStorage(){
                return(state, error) => {
                    // Mark the store as hydrated only when restoration completes without an error.
                    if(!error) state?.setHydrated
                }
            }
        }
    )
)