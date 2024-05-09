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
@startuml Interaction
hide empty description

state "Edit (Item) Window" as editWindow {
  state "Off" as editOff #yellow : hide window
  state "On" as editOn : show window
  [*] --> editOff
  editOff --> editOn : click \n on (Item)
  editOn -up-> editOff : click \n on background
}

state "Common" as common {
  state "Idle" as idle #yellow
  state "Moving Viewport" as moveViewport : mouse move
  state "Shaping Link" as shapeLink : mouse move
  state "Shaping Flow" as shapeFlow : mouse move
  state ": create Variable" as addVariable #white ##white
  state ": toggle Variable \n / Stock" as toggleVariableStock #white ##white
  state ": change direction" as changeDirection #white ##white

  [*] -> idle
  idle -up[#blue]-> shapeLink : down \n on Link
  shapeLink --> idle : up

  idle -up[#blue]-> shapeFlow : down \n on Flow \n / Valve \n / Source \n / Sink
  shapeFlow --> idle : up

  idle -up[#green]-> moveViewport : down \n on background
  moveViewport --> idle : up

  idle -[#red]-> addVariable : double click \n on background
  addVariable -up-> idle

  idle -[#purple]-> toggleVariableStock : double click \n on Varialble \n / Stock
  toggleVariableStock -up-> idle

  idle -[#purple]-> changeDirection : double click \n on Link \n / Flow
  changeDirection -up-> idle

}

state "Move Variable / Stock Mode" as modeMoveVariableStock {
  state "Idle" as idle1 #yellow
  state "Moving Variable" as moveVariable : mouse move
  state "Moving Stock" as moveStock : mouse move

  [*] -> idle1

  idle1 -[#blue]-> moveVariable : down \n on Variable
  moveVariable -up-> idle1 : up

  idle1 -[#blue]-> moveStock : down \n on Stock
  moveStock -up-> idle1 : up

}

state "Add Link / Flow Mode" as modeAddLinkFlow {
  state "Idle" as idle2 #yellow
  state "Dragging New \n Link / Flow" as dragNewLinkFlow : mouse move
  state ": create Link" as addLink #white ##white
  state ": create Flow" as addFlow #white ##white

  [*] -> idle2

  idle2 -[#red]-> dragNewLinkFlow : down \n on Variable \n / Stock

  dragNewLinkFlow -left> addLink : up \n on Variable \n / Valve \n from Variable
  addLink -up-> idle2

  dragNewLinkFlow -> addFlow : up \n on Stock \n / background \n from Stock
  addFlow -up-> idle2

}

[*] -> modeMoveVariableStock
modeMoveVariableStock -> modeAddLinkFlow
modeAddLinkFlow -> modeMoveVariableStock

modeMoveVariableStock -up[hidden]-> editWindow

@enduml
```
