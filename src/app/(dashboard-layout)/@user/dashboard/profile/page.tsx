import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { userService } from "@/services/user.service"
import { UpdateProfile } from "../components/UpdateProfile"

const getText = (value: unknown, fallback = "Not provided") =>
    typeof value === "string" && value.trim().length > 0 ? value : fallback

const formatDate = (value: unknown) => {
    if (typeof value !== "string" || !value.trim()) return "Not available"
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? "Not available" : parsed.toLocaleString()
}

const getInitials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "U"

async function ProfilePage() {
    const { user, error } = await userService.getSession()

    if (error) {
        return (
            <section className="w-full p-4 sm:p-6 lg:p-8">
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                    <p className="text-sm font-semibold text-rose-700">Could not load your profile</p>
                    <p className="mt-1 text-sm text-rose-600">{error}</p>
                </div>
            </section>
        )
    }

    if (!user) {
        return (
            <section className="w-full p-4 sm:p-6 lg:p-8">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <p className="text-sm font-semibold text-amber-800">You are not signed in</p>
                    <p className="mt-1 text-sm text-amber-700">Please sign in to see your profile information.</p>
                </div>
            </section>
        )
    }

    const name = getText(user.name, "User")
    const email = getText(user.email, "No email")
    const imageUrl = getText(user.image, "")
    const role = getText(user.role, "Unknown")
    const userId = getText(user.id, "N/A")
    const createdAt = formatDate(user.createdAt)
    const updatedAt = formatDate(user.updatedAt)
    const isActive = user.isActive === true
    const isVerified = user.emailVerified === true

    return (
        <section className="w-full p-4 sm:p-6 lg:p-8">
            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
                <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Profile</p>
                <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">My Account</h1>
                <p className="mt-1 text-sm text-muted-foreground">View your account details and activity status.</p>

                <div className="mt-5 flex flex-wrap items-center gap-4 rounded-xl border border-border/70 bg-muted/25 p-4">
                    <Avatar className="size-16">
                        {imageUrl ? <AvatarImage src={imageUrl} alt={name} /> : null}
                        <AvatarFallback>{getInitials(name)}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-48">
                        <div>
                            <p className="text-lg font-bold text-foreground">{name}</p>
                            <p className="text-sm text-muted-foreground">{email}</p>
                        </div>
                         <UpdateProfile name={name} imageUrl={imageUrl}/>
                    </div>

                    <div className="ml-auto flex flex-wrap gap-2">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${isVerified
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                                }`}
                        >
                            {isVerified ? "Email Verified" : "Email Not Verified"}
                        </span>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${isActive
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                                    : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                                }`}
                        >
                            {isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <article className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Role</p>
                    <p className="mt-2 text-base font-semibold text-foreground">{role}</p>
                </article>
                <article className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">User ID</p>
                    <p className="mt-2 break-all text-base font-semibold text-foreground">{userId}</p>
                </article>
                <article className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Created At</p>
                    <p className="mt-2 text-base font-semibold text-foreground">{createdAt}</p>
                </article>
                <article className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Updated At</p>
                    <p className="mt-2 text-base font-semibold text-foreground">{updatedAt}</p>
                </article>
            </div>

        </section>
    )
}

export default ProfilePage
