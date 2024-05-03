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
  state "View" as modeView #yellow
  state "Edit" as modeEdit
  state "Add Link / Flow" as modeAddLinkFlow

  [*] --> modeView
  modeView -> modeEdit
  modeEdit -up-> modeView

  modeAddLinkFlow -> modeEdit
  modeEdit -> modeAddLinkFlow
  modeView --> modeAddLinkFlow
  modeAddLinkFlow -up-> modeView

}

@enduml
```

```plantuml
@startuml View
hide empty description

state "View" as modeView {
  state "Idle" as idle #yellow
  state "Moving Canvas" as moveCanvas : mouse move

  [*] -> idle
  idle -[#green]> moveCanvas : down \n on background
  moveCanvas -> idle : up

}

@enduml
```

```plantuml
@startuml Edit
hide empty description

state "Edit" as modeEdit {
  state "Idle" as idle #yellow
  state "Moving Canvas" as moveCanvas : mouse move
  state "Moving Variable" as moveVariable : mouse move
  state "Moving Stock" as moveStock : mouse move
  state ": create Variable" as addVariable #white ##white
  state ": toggle Variable \n / Stock" as toggleVariableStock #white ##white

  [*] -> idle
  idle -[#green]-> moveCanvas : down \n on background
  moveCanvas --> idle : up

  idle -up[#blue]-> moveVariable : down \n on Variable
  moveVariable --> idle : up

  idle -up[#blue]-> moveStock : down \n on Stock
  moveStock --> idle : up

  idle -[#red]-> addVariable : click \n on background
  addVariable -up-> idle

  idle -[#purple]-> toggleVariableStock : double click \n on Varialble \n / Stock
  toggleVariableStock -up-> idle

  state "Shaping Link" as shapeLink : mouse move
  state "Shaping Flow" as shapeFlow : mouse move

  idle -up[#blue]-> shapeLink : down \n on Link
  shapeLink --> idle : up

  idle -up[#blue]-> shapeFlow : down \n on Flow \n / Valve \n / Source \n / Sink
  shapeFlow --> idle : up

  state ": change direction" as changeDirection #white ##white

  idle -[#purple]-> changeDirection : double click \n on Link \n / Flow
  changeDirection -up-> idle

}

@enduml
```

```plantuml
@startuml Add Link / Flow
hide empty description

state "Add Link / Flow" as modeAddLinkFlow {
  state "Idle" as idle #yellow
  state "Moving Canvas" as moveCanvas : mouse move
  state "Shaping Link" as shapeLink : mouse move
  state "Shaping Flow" as shapeFlow : mouse move
  state "Dragging New \n Link / Flow" as dragNewLinkFlow : mouse move
  state ": create Link" as addLink #white ##white
  state ": create Flow" as addFlow #white ##white
  state ": change direction" as changeDirection #white ##white


  [*] -> idle
  idle -[#green]-> moveCanvas : down \n on background
  moveCanvas --> idle : up

  idle -up[#blue]-> shapeLink : down \n on Link
  shapeLink --> idle : up

  idle -up[#blue]-> shapeFlow : down \n on Flow \n / Valve \n / Source \n / Sink
  shapeFlow --> idle : up

  idle -[#red]--> dragNewLinkFlow : down \n on Variable \n / Stock
  dragNewLinkFlow -up-> addLink : up \n on Variable \n / Valve \n from Variable
  addLink -up-> idle

  dragNewLinkFlow -> addFlow : up \n on Stock \n / background \n from Stock
  addFlow -up-> idle

  idle -[#purple]up-> changeDirection : double click \n on Link \n / Flow
  changeDirection --> idle

  state ": toggle Variable \n / Stock" as toggleVariableStock #white ##white

  idle -up[#purple]-> toggleVariableStock : double click \n on Varialble \n / Stock
  toggleVariableStock --> idle

}

@enduml
```
