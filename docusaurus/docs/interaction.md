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

- Add Flow: creating Flow, up on Stock, edit Flow
- else: move canvas

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
@startuml SystemMap
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
  state "Add Link" as modeAddLink
  state "Add Stock" as modeAddStock
  state "Add Flow" as modeAddFlow
  state modeChoice <<choice>>

  [*] --> modeReadOnly
  modeReadOnly -> modeChoice
  modeChoice -up-> modeReadOnly
  modeMoveItem --> modeChoice
  modeChoice -up-> modeMoveItem

  modeChoice --> modeAddVariable
  modeAddVariable -up-> modeChoice
  modeChoice --> modeAddLink
  modeAddLink -up-> modeChoice
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
@startuml SystemMap
hide empty description

state "Read Only" as modeReadOnly {
  state "Idle" as idle #yellow
  state "Moving Canvas" as moveCanvas

  [*] -> idle
  idle -[#green]-> moveCanvas : down \n on background
  moveCanvas -up-> idle : up

}

@enduml
```

```plantuml
@startuml SystemMap
hide empty description

state "Move / Shape (Item)" as modeMoveItem {
  state "Idle" as idle #yellow
  state "Moving Canvas" as moveCanvas
  state "Moving / Shpaing (Item)" as moveItem : States: \n - Moving Variable (Variable) \n - Moving Stock (Stock) \n - Shaping Link (Link) \n - Shaping Flow (Valve, Source, Sink)

  [*] -> idle
  idle -[#green]-> moveCanvas : down \n on background
  moveCanvas -up-> idle : up

  idle -up[#blue]-> moveItem : down \n on (Item)
  moveItem --> idle : up

}

@enduml
```

```plantuml
@startuml SystemMap
hide empty description

state "Add Variable" as modeAddVariable {
  state "Idle" as idle #yellow
  state "Moving Canvas" as moveCanvas
  state "Moving / Shpaing (Item)" as moveItem : States: \n - Moving Variable (Variable) \n - Moving Stock (Stock) \n - Shaping Link (Link) \n - Shaping Flow (Valve, Source, Sink)

  [*] -> idle
  idle -[#green]-> moveCanvas : down \n on background
  moveCanvas -up-> idle : up

  idle -up[#blue]-> moveItem : down \n on (Item)
  moveItem --> idle : up

  idle -[#red]> idle : click \n on background \n : new Variable \n : Edit Variable Window On
}

@enduml
```

```plantuml
@startuml SystemMap
hide empty description

state "Add Stock" as modeAddStock {
  state "Idle" as idle #yellow
  state "Moving Canvas" as moveCanvas
  state "Moving / Shpaing (Item)" as moveItem : States: \n - Moving Variable (Variable) \n - Moving Stock (Stock) \n - Shaping Link (Link) \n - Shaping Flow (Valve, Source, Sink)

  [*] -> idle
  idle -[#green]-> moveCanvas : down \n on background
  moveCanvas -up-> idle : up

  idle -up[#blue]-> moveItem : down \n on (Item)
  moveItem --> idle : up

  idle -[#red]-> idle : click \n on background \n : new Stock \n : Edit Stock Window On
}

@enduml
```

```plantuml
@startuml SystemMap
hide empty description

state "Add Link" as modeAddLink {
  state "Idle" as idle #yellow
  state "Moving Canvas" as moveCanvas
  state "Moving / Shpaing (Item)" as moveItem : States: \n - Shaping Link (Link) \n - Shaping Flow (Valve, Source, Sink)
  state "Dragging Link" as dragLink

  [*] -> idle
  idle -[#green]-> moveCanvas : down \n on background
  moveCanvas -up-> idle : up

  idle -up[#blue]-> moveItem : down \n on (Item)
  moveItem --> idle : up

  idle -[#red]> dragLink : down \n on Variable / Stock
  dragLink -> idle : up \n on Variable / Valve \n :new Link \n : Edit Link Window on
}

@enduml
```

```plantuml
@startuml SystemMap
hide empty description

state "Add Flow" as modeAddFlow {
  state "Idle" as idle #yellow
  state "Moving / Shpaing (Item)" as moveItem : States: \n - Moving Variable (Variable) \n - Shaping Link (Link) \n - Shaping Flow (Valve, Source, Sink)
  state "Dragging Flow \n From Source" as dragFlowSource
  state "Dragging Flow \n From Stock" as dragFlowStock

  [*] -> idle
  idle -[#red]-> dragFlowSource : down \n on background
  dragFlowSource -up-> idle : up \n on Stock \n : new Flow \n : Edit Flow Window on

  idle -up[#blue]-> moveItem : down \n on (Item)
  moveItem --> idle : up

  idle -[#red]> dragFlowStock : down \n on Stock
  dragFlowStock -> idle : up \n on Stock / background \n : new Flow \n : Edit Flow Window on


}

@enduml
```
