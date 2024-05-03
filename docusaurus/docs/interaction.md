---
sidebar_position: 2
---

# Interaction

(Item) includes:

- Variable
- Link
- Stock
- Flow
  - Valve
  - Source
  - Sink

## Mouse left down and move

down on background and move:

- all: move canvas

down on Variable and move:

- Add Link: creating Link, up on Variable or Valve, edit Link
- else: move Variable

down on Stock and move:

- Add Flow: creating Flow, up on Stock or background, edit Flow
- Add Link: creating Link, up on Variable or Valve, edit Link
- else: move Stock

down on Link and move:

- all: shape Link

down on Valve / Source / Sinck and move:

- all: shape Flow

## Mouse left click

click on background:

- Add Variable: create Variable, edit Variable
- Add Stock: create Stock, edit Stock
- else: leave edit

click on items:

- all: edit (Item)

## State Diagram

```plantuml
@startuml Mode
hide empty description

state "Edit (Item) Window" as editWindow {
  state "Off" as editOff #yellow : hide window
  state "On" as editOn : show window
  [*] --> editOff
  editOff --> editOn : click \n on (Item)
  editOn -up-> editOff : click \n on background
}

state "Mode" as editMode {
  state "Read Only" as modeReadOnly #yellow
  state "Move / Shape (Item)" as modeMoveItem
  state "Add Variable" as modeAddVariable
  state "Add Stock" as modeAddStock
  state "Add Link / Flow" as modeAddFlow
  state modeChoice <<choice>>

  [*] --> modeReadOnly
  modeReadOnly -> modeChoice
  modeChoice -up-> modeReadOnly
  modeMoveItem --> modeChoice
  modeChoice -up-> modeMoveItem

  modeChoice --> modeAddVariable
  modeAddVariable -up-> modeChoice
  modeChoice --> modeAddStock
  modeAddStock -up-> modeChoice
  modeChoice --> modeAddFlow
  modeAddFlow -up-> modeChoice

  note right of modeChoice
    Change Mode
  end note
}

@enduml
```

```plantuml
@startuml Read Only
hide empty description

state "Read Only" as modeReadOnly {
  state "Idle" as idle #yellow
  state "Moving Canvas" as moveCanvas

  [*] -> idle
  idle -[#green]> moveCanvas : down \n on background
  moveCanvas -> idle : up

}

@enduml
```

```plantuml
@startuml Move / Shape (Item)
hide empty description

state "Move / Shape (Item)" as modeMoveItem {
  state "Idle" as idle #yellow
  state "Moving Canvas" as moveCanvas
  state "Moving / Shpaing (Item)" as moveItem : States: \n - Moving Variable (Variable) \n - Moving Stock (Stock) \n - Shaping Link (Link) \n - Shaping Flow (Valve, Source, Sink)

  [*] -> idle
  idle -[#green]> moveCanvas : down \n on background
  moveCanvas -> idle : up

  idle -up[#blue]-> moveItem : down \n on (Item)
  moveItem --> idle : up
}

@enduml
```

```plantuml
@startuml Add Variable
hide empty description

state "Add Variable" as modeAddVariable {
  state "Idle" as idle #yellow
  state "Moving Canvas" as moveCanvas
  state "Moving / Shpaing (Item)" as moveItem : States: \n - Moving Variable (Variable) \n - Moving Stock (Stock) \n - Shaping Link (Link) \n - Shaping Flow (Valve, Source, Sink)
  state ": create Variable" as addVariable #white ##white

  [*] -> idle
  idle -[#green]> moveCanvas : down \n on background
  moveCanvas -> idle : up

  idle -up[#blue]-> moveItem : down \n on (Item)
  moveItem --> idle : up

  idle -down[#red]-> addVariable : click \n on background
  addVariable -up-> idle
}

@enduml
```

```plantuml
@startuml Add Stock
hide empty description

state "Add Stock" as modeAddStock {
  state "Idle" as idle #yellow
  state "Moving Canvas" as moveCanvas
  state "Moving / Shpaing (Item)" as moveItem : States: \n - Moving Variable (Variable) \n - Moving Stock (Stock) \n - Shaping Link (Link) \n - Shaping Flow (Valve, Source, Sink)
  state ": create Stock" as addStock #white ##white

  [*] -> idle
  idle -[#green]> moveCanvas : down \n on background
  moveCanvas -> idle : up

  idle -up[#blue]-> moveItem : down \n on (Item)
  moveItem --> idle : up

  idle -[#red]-> addStock : click \n on background
  addStock -up-> idle
}

@enduml
```

```plantuml
@startuml Add Link / Flow
hide empty description

state "Add Link / Flow" as modeAddLinkFlow {
  state "Idle" as idle #yellow
  state "Moving Canvas" as moveCanvas
  state "Moving / Shpaing (Item)" as moveItem : States: \n - Shaping Link (Link) \n - Shaping Flow (Valve, Source, Sink)
  state "Dragging Link" as dragLink
  state "Dragging Flow" as dragFlowStock

  [*] -> idle
  idle -right[#green]> moveCanvas : down \n on background
  moveCanvas -> idle : up

  idle -up[#blue]-> moveItem : down \n on (Item)
  moveItem --> idle : up

  idle -[#red]-> dragLink : down \n on Variable / Stock
  dragLink -up-> idle : up \n on Variable / Valve \n :create Link

  idle -[#red]--> dragFlowStock : down \n on Stock
  dragFlowStock -up--> idle : up \n on Stock / background \n : create Flow

}

@enduml
```
