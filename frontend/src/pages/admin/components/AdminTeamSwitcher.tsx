import * as React from "react"
import { Building2Icon, ChevronsUpDownIcon, CheckIcon, PlusCircleIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const workspaces = [
  { id: "hq", name: "Sun Tours Da Nang", role: "HQ Enterprise", badge: "HQ" },
  { id: "hn", name: "Sun Tours Hanoi", role: "Northern Branch", badge: "HN" },
  { id: "sg", name: "Sun Tours Saigon", role: "Southern Branch", badge: "SG" },
]

export function AdminTeamSwitcher() {
  const [selected, setSelected] = React.useState(workspaces[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-lg p-1.5 text-left text-sm transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar size="sm" className="size-8 rounded-lg bg-primary text-primary-foreground font-bold">
          <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
            {selected.badge}
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:grid flex-1 text-left text-xs leading-tight">
          <span className="truncate font-semibold text-foreground">{selected.name}</span>
          <span className="truncate text-[10px] text-muted-foreground">{selected.role}</span>
        </div>
        <ChevronsUpDownIcon className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => setSelected(ws)}
            className="flex items-center justify-between cursor-pointer text-xs"
          >
            <div className="flex items-center gap-2">
              <Building2Icon className="size-3.5 text-muted-foreground" />
              <div>
                <p className="font-medium leading-none">{ws.name}</p>
                <p className="text-[10px] text-muted-foreground">{ws.role}</p>
              </div>
            </div>
            {selected.id === ws.id && <CheckIcon className="size-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
          <PlusCircleIcon className="mr-2 size-3.5" />
          Add Branch Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
