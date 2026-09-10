//params is a Promise, so it must be awaited
type UserProfileProps = {
    params: Promise<{ id: string }>
}

export default async function UserProfile({params}: UserProfileProps) {
    const { id } = await params

    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <hr/>
            <p className="text-lg">Welcome {id}</p>
            <span className="p-2 rounded bg-amber-400 text-black ml-2">{id}</span>
        </div>
    )
}