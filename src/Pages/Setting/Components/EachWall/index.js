import React, { useEffect } from "react";
import { connect } from 'react-redux';
import "./index.scss";
import Snap from 'snapsvg-cjs';

const EachWall = ({selectTheWall, surfaceData, setStep}) => {
  useEffect(() => {
    const s = Snap("#snap-svg");
    const post_group = s.g().attr({id: 'posts'});
    const dimension_group = s.g().attr({id: 'dimensions'});
    const bc_colors = [
      "#373737",
      "#727272",
      "#9B9B9B",
    ];
    const line_delta = 1;
    const dimension_depth = 30;
    const strokeWidth = 2;
    const topY = 3 * strokeWidth;
    const svg_width = surfaceData.Bottom.width + 2 * dimension_depth;
    const svg_height = surfaceData.Left.width + 2 * strokeWidth + topY + strokeWidth / 2 + dimension_depth;
    const side_depth = 10;
    const postWidth = 2;
    const per_inch = 12;

    const panel_length = (pos) => {
      const width = surfaceData[toUpper(pos)].width
      return width > 30 * per_inch ? 10 : 8
    }

    const drawSideSurface = (s, pos, x, y, width, height) => {
      const door = surfaceData[toUpper(pos)]?.door;
      const door_pos = door?.style ? door?.pos : '';
      const getSideLength = (type) => {
        let length;

        switch(pos) {
          case 'left':
          case 'right':
            if(type === 'width') length = side_depth
            else length = height
            break;
          case 'bottom':
            if(type === 'depth') length = side_depth;
            else length = width
            break;
          default: break;
        }

        return length
      }
      const delta_door = () => {
        let side_length =
          surfaceData[toUpper(pos)]?.width -
            2 * postWidth -
            (door?.wide ? door?.wide + 2 * postWidth : 0);
        let delta = 0;
        const door_filler = () => {
          let filler = 0;

          if(
            door?.wide &&
            (
              (pos === 'left' && door_pos === 'Left Of Center') ||
              (pos === 'right' && door_pos === 'Right Of Center')
            )
          ) {
            let length = side_length - per_inch;
            let panel_count = Math.floor((length + postWidth) / ( per_inch * panel_length(pos) + postWidth ));
            let rest_length = length + postWidth - ( per_inch * panel_length(pos) + postWidth ) * panel_count;
  
            if(panel_count && rest_length) {
              panel_count = panel_count - 1;
              rest_length = length - ( per_inch * panel_length(pos) + postWidth ) * panel_count
            }
  
            if(rest_length > (panel_length(pos) + 1) * per_inch) {
              let last_panel = Math.round(Math.floor(rest_length / per_inch) / 2);
              filler = (rest_length - postWidth - last_panel * per_inch) % 12;
            } else filler = rest_length % per_inch;
          }

          return filler
        }

        switch(door_pos) {
          case 'Far Left':
            delta = 0; break;
          case 'Left Of Center':
            delta = postWidth + per_inch + door_filler();
            break;
          case 'Center':
            let panel_count = Math.round(Math.floor(side_length / per_inch) / 2)
            delta = side_length - per_inch * panel_count - postWidth * Math.floor((panel_count - 1) / panel_length(pos)) + postWidth;
            break;
          case 'Right Of Center':
            delta = postWidth + side_length - per_inch - door_filler();
            break;
          case 'Far Right':
            delta = side_length + 2 * postWidth;
            break;
          default: delta = 0; break;
        }

        return delta
      }
      const door_x = () => {
        let x = 0;

        switch(pos) {
          case 'left':
            x = 1; break;
          case 'bottom':
            x = postWidth + 1 + delta_door(); break;
          case 'right':
            x = surfaceData.Bottom.width - postWidth; break;
          default: break;
        }

        return (x || 0);
      }
      const door_y = () => {
        let sideSurface = surfaceData[toUpper(pos)];
        let y = 0;

        switch(pos) {
          case 'left':
            y = postWidth + delta_door();
            break;
          case 'bottom':
            y = surfaceData.Left.width - postWidth - 1; break;
          case 'right':
            if(door_pos === 'Center') y = postWidth + delta_door();
            else
              y =
                height -
                (sideSurface?.door?.wide || 0) -
                postWidth -
                delta_door();
            break;
          default: break;
        }

        return (y || 0);
      }

      let g = s.g().attr({id: pos})
      let side = g.svg(x, y, getSideLength('width'), getSideLength('depth'), 0, 0, getSideLength('width'), getSideLength('depth'))
      side.rect(width < height ? 1 : 0, width < height ? 0 : 1, width, height)
        .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ffffff'});

      const line_group = side.g()
      for(let i = 0; i < (width > height ? width : height) / 2; i++) {
        if(width < height)
          line_group.line(1, 2 * i, 2, 2 * i,)
            .attr({stroke: bc_colors[1], strokeWidth: 0.1});
        else
          line_group.line(2 * i, 1, 2 * i, 2,)
            .attr({stroke: bc_colors[1], strokeWidth: 0.1});
      }

      if(door?.wide)
        drawDoor(g, door_x(), door_y(), pos, door)

      bc_post(pos, door_x(), door_y());
    }

    const drawSurface = () => {
      let line_taper = 5;

      // Back wall
      s.line(line_delta + dimension_depth - line_taper, topY, svg_width + line_delta - dimension_depth + line_taper, topY)
        .attr({stroke: bc_colors[0], strokeWidth: 2});
      s.text("50%", strokeWidth, 'EXTERIOR WALL').attr({
        style: `font-size: 2px`,
        "dominant-baseline": "middle",
        "text-anchor": "middle",
      });

      // Main surface
      const main_surface = s.svg(
        dimension_depth,
        topY + strokeWidth / 2,
        surfaceData.Bottom.width + strokeWidth,
        surfaceData.Left.width + strokeWidth,
        0,
        0,
        surfaceData.Bottom.width + strokeWidth,
        surfaceData.Left.width + strokeWidth
      )

      // Left surface
      drawSideSurface(main_surface, 'left', 1, 0, 1, surfaceData.Left.width);
      // Bottom surface
      drawSideSurface(main_surface, 'bottom', 1, surfaceData.Left.width - postWidth - 1, surfaceData.Bottom.width, 1);
      // Right_surface
      drawSideSurface(main_surface, 'right', surfaceData.Bottom.width - postWidth, 0, 1, surfaceData.Left.width);

      drawpost();

      s.append(dimension_group)
      main_surface.append(post_group)
    }

    const drawpost = () => {
      post_group.rect(1, 0, postWidth, postWidth).attr({stroke: bc_colors[2], fill: bc_colors[2], strokeWidth: 0})
      post_group.rect(surfaceData.Bottom.width - 1, 0, postWidth, postWidth).attr({stroke: bc_colors[2], fill: bc_colors[2], strokeWidth: 0})
      post_group.rect(1, surfaceData.Left.width - postWidth, postWidth, postWidth)
        .attr({stroke: bc_colors[2], fill: bc_colors[2], strokeWidth: 0})
        post_group.rect(surfaceData.Bottom.width - 1, surfaceData.Left.width - postWidth, postWidth, postWidth)
        .attr({stroke: bc_colors[2], fill: bc_colors[2], strokeWidth: 0})
    }
    
    const bc_post = (pos, door_x, door_y) => {
      let sideSurface = surfaceData[toUpper(pos)];
      let length = sideSurface?.width - 2 * postWidth;
      let left_filler = 0;
      let right_filler = 0;

      const delta_door_x = (post_pos) => {
        let temp_x;
        switch(pos) {
          case 'left':
            if(post_pos === 'right')
              temp_x = 0;
            else temp_x = 0;
            break;
          case 'bottom':
            if(post_pos === 'right')
              temp_x = (sideSurface?.door?.wide || - postWidth);
            else temp_x = - postWidth;
            break;
          case 'right':
            if(post_pos === 'right')
              temp_x = 1;
            else temp_x = 1;
            break;
          default: break;
        }
        return temp_x;
      }
      const delta_door_y = (post_pos) => {
        let temp_y;
        switch(pos) {
          case 'left':
            if(post_pos === 'right')
              temp_y = (sideSurface?.door?.wide || - postWidth);
            else temp_y = - postWidth;
            break;
          case 'bottom':
            if(post_pos === 'right')
              temp_y = 1;
            else temp_y = 1;
            break;
          case 'right':
            if(post_pos === 'right')
             temp_y = sideSurface?.door?.wide ? - postWidth : 0;
            else temp_y = (sideSurface?.door?.wide || - postWidth);
            break;
          default: break;
        }
        return temp_y;
      }

      if(sideSurface?.door?.style) {
        // the post for the left of the door
        post_group.rect(door_x + delta_door_x('left'), door_y + delta_door_y('left'), postWidth, postWidth)
          .attr({stroke: bc_colors[2], fill: bc_colors[2], strokeWidth: 0})
        // the post for the right of the door
        post_group.rect(door_x + delta_door_x('right'), door_y + delta_door_y('right'), postWidth, postWidth)
          .attr({stroke: bc_colors[2], fill: bc_colors[2], strokeWidth: 0})
      }

      // draw the posts to the left
      if(
        sideSurface?.door?.style &&
        (
          sideSurface?.door?.pos === 'Left Of Center' ||
          sideSurface?.door?.pos === 'Center' ||
          sideSurface?.door?.pos === 'Right Of Center' ||
          sideSurface?.door?.pos === 'Far Right'
        )
      ) {
        const delta_x = (index) => {
          let temp_x;
          switch(pos) {
            case 'left':
              temp_x = 1; break;
            case 'bottom':
              temp_x =
                (door_x + delta_door_x('left')) - (per_inch * panel_length(pos) + postWidth) * (index + 1);
              break;
            case 'right':
              temp_x = door_x + 1; break;
            default: break;
          }
          return temp_x;
        }
        const delta_y = (index) => {
          let temp_y;
          switch(pos) {
            case 'left':
              temp_y =
                (door_y + delta_door_y('left')) - (per_inch * panel_length(pos) + postWidth) * (index + 1);
              break;
            case 'bottom':
              temp_y = door_y + 1; break;
            case 'right':
              temp_y =
                (door_y + delta_door_y('left')) + (per_inch * panel_length(pos) + postWidth) * (index + 1);
              break;
            default: break;
          }
          return temp_y;
        }
        let left_length = 
          pos === 'bottom' ?
            door_x + delta_door_x('left') - 1 :
            pos === 'left' ?
              door_y + delta_door_y('left') :
              length - door_y - delta_door_y('left') + postWidth;
        let left_panel_count = Math.floor(left_length / ( per_inch * panel_length(pos) + postWidth ));
        let rest_left_length = left_length - ( per_inch * panel_length(pos) + postWidth ) * left_panel_count

        if(left_panel_count && rest_left_length) {
          left_panel_count = left_panel_count - 1;
          rest_left_length = left_length - ( per_inch * panel_length(pos) + postWidth ) * left_panel_count
        }

        for (let i = 0; i < left_panel_count; i++) {
          post_group.rect(delta_x(i), delta_y(i), postWidth, postWidth)
            .attr({stroke: bc_colors[2], fill: bc_colors[2], strokeWidth: 0})
          bc_dimension(pos, delta_x(i - 1), delta_y(i - 1), delta_x(i), delta_y(i))
        }

        if(rest_left_length > (panel_length(pos) + 1) * per_inch) {
          let last_panel = Math.round(Math.floor((rest_left_length - postWidth) / per_inch) / 2);
          let rest_panel = Math.floor((rest_left_length - 2 * postWidth - last_panel * per_inch) / per_inch);
          left_filler = (rest_left_length - 2 * postWidth - last_panel * per_inch) % 12;
  
          switch(pos) {
            case 'left':
              post_group.rect(delta_x(left_panel_count - 1), delta_y(left_panel_count - 1) - postWidth - last_panel * per_inch, postWidth, postWidth)
                .attr({stroke: bc_colors[2], fill: bc_colors[2], strokeWidth: 0})
              bc_dimension(
                pos,
                delta_x(left_panel_count - 1),
                delta_y(left_panel_count - 1) - postWidth - last_panel * per_inch,
                delta_x(left_panel_count - 1),
                delta_y(left_panel_count - 1),
              )
              bc_dimension(
                pos,
                delta_x(left_panel_count - 1),
                delta_y(left_panel_count - 1) - 2 * postWidth - (last_panel + rest_panel) * per_inch,
                delta_x(left_panel_count - 1),
                delta_y(left_panel_count - 1) - postWidth - last_panel * per_inch,
              )
              break;
            case 'right':
              post_group.rect(delta_x(left_panel_count - 1), delta_y(left_panel_count - 1) + postWidth + last_panel * per_inch, postWidth, postWidth)
                .attr({stroke: bc_colors[2], fill: bc_colors[2], strokeWidth: 0})
              bc_dimension(
                pos,
                delta_x(left_panel_count - 1),
                delta_y(left_panel_count - 1) + postWidth + last_panel * per_inch,
                delta_x(left_panel_count - 1),
                delta_y(left_panel_count - 1),
              )
              bc_dimension(
                pos,
                delta_x(left_panel_count - 1),
                delta_y(left_panel_count - 1) + 2 * postWidth + (last_panel + rest_panel) * per_inch,
                delta_x(left_panel_count - 1),
                delta_y(left_panel_count - 1) + postWidth + last_panel * per_inch,
              )
              break;
            case 'bottom':
              post_group.rect(delta_x(left_panel_count - 1) - postWidth - last_panel * per_inch, delta_y(left_panel_count - 1), postWidth, postWidth)
                .attr({stroke: bc_colors[2], fill: bc_colors[2], strokeWidth: 0})
              bc_dimension(
                pos,
                delta_x(left_panel_count - 1) - postWidth - last_panel * per_inch,
                delta_y(left_panel_count - 1),
                delta_x(left_panel_count - 1),
                delta_y(left_panel_count - 1),
              )
              bc_dimension(
                pos,
                delta_x(left_panel_count - 1) - 2 * postWidth - (last_panel + rest_panel) * per_inch,
                delta_y(left_panel_count - 1),
                delta_x(left_panel_count - 1) - postWidth - last_panel * per_inch,
                delta_y(left_panel_count - 1),
              )
              break;
            default: break;
          }
        } else if(rest_left_length) {
          left_filler = (rest_left_length - postWidth) % per_inch;

          switch(pos) {
            case 'left':
              bc_dimension(
                pos,
                delta_x(left_panel_count-1),
                delta_y(left_panel_count-1) - rest_left_length + left_filler,
                delta_x(left_panel_count-1),
                delta_y(left_panel_count-1),
              )
              break;
            case 'right':
              bc_dimension(
                pos,
                delta_x(left_panel_count-1),
                delta_y(left_panel_count-1) + rest_left_length - left_filler,
                delta_x(left_panel_count-1),
                delta_y(left_panel_count-1),
              )
              break;
            case 'bottom':
              bc_dimension(
                pos,
                delta_x(left_panel_count-1) - rest_left_length + left_filler,
                delta_y(left_panel_count-1),
                delta_x(left_panel_count-1),
                delta_y(left_panel_count-1),
              )
              break;
            default: break;
          }
        }
      }

      // draw the posts to the right
      const delta_x = (index) => {
        let temp_x;
        switch(pos) {
          case 'left':
            temp_x = 1; break;
          case 'bottom':
            temp_x =
              (door_x + delta_door_x('right') - 1) + (per_inch * panel_length(pos) + postWidth) * (index + 1) + 1;
            break;
          case 'right':
            temp_x = door_x + 1; break;
          default: break;
        }
        return temp_x;
      }
      const delta_y = (index) => {
        let temp_y;
        switch(pos) {
          case 'left':
            if(!sideSurface?.door?.wide)
              temp_y =
                surfaceData.Left.width - postWidth - (per_inch * panel_length(pos) + postWidth) * (index + 1);
            else
              temp_y =
                (door_y + delta_door_y('right')) + (per_inch * panel_length(pos) + postWidth) * (index + 1);
            break;
          case 'bottom':
            temp_y = door_y + 1; break;
          case 'right':
            temp_y =
              door_y + delta_door_y('right') - (per_inch * panel_length(pos) + postWidth) * (index + 1);
            break;
          default: break;
        }
        return temp_y;
      }
      let right_length =
        pos === 'bottom' ?
          (length - door_x - delta_door_x('right') + postWidth + 1) :
          pos === 'left' ?
            (length - door_y - delta_door_y('right') + postWidth) :
            (door_y + delta_door_y('right'))
      let right_panel_count = Math.floor(right_length / ( per_inch * panel_length(pos) + postWidth ));
      let rest_right_length = right_length - ( per_inch * panel_length(pos) + postWidth ) * right_panel_count

      if(right_panel_count && rest_right_length) {
        right_panel_count = right_panel_count - 1;
        rest_right_length = right_length - ( per_inch * panel_length(pos) + postWidth ) * right_panel_count
      }

      for (let i = 0; i < right_panel_count; i++) {
        post_group.rect(delta_x(i), delta_y(i), postWidth, postWidth)
          .attr({stroke: bc_colors[2], fill: bc_colors[2], strokeWidth: 0})
        bc_dimension(pos, delta_x(i - 1), delta_y(i - 1), delta_x(i), delta_y(i))
      }

      if(rest_right_length > (panel_length(pos) + 1) * per_inch) {
        let last_panel = Math.round(Math.floor((rest_right_length - postWidth) / per_inch) / 2);
        let rest_panel = Math.floor((rest_right_length - 2 * postWidth - last_panel * per_inch) / per_inch);
        right_filler = (rest_right_length - 2 * postWidth - last_panel * per_inch) % 12;

        switch(pos) {
          case 'left':
            let direction = sideSurface?.door?.wide ? 1 : -1;
            post_group.rect(delta_x(right_panel_count - 1), delta_y(right_panel_count - 1) + (postWidth + last_panel * per_inch) * direction, postWidth, postWidth)
              .attr({stroke: bc_colors[2], fill: bc_colors[2], strokeWidth: 0})
            bc_dimension(
              pos,
              delta_x(right_panel_count - 1),
              delta_y(right_panel_count - 1),
              delta_x(right_panel_count - 1),
              delta_y(right_panel_count - 1) + (postWidth + last_panel * per_inch) * direction
            )
            bc_dimension(
              pos,
              delta_x(right_panel_count - 1),
              delta_y(right_panel_count - 1) +
                (postWidth + last_panel * per_inch) * direction,
              delta_x(right_panel_count - 1),
              delta_y(right_panel_count - 1) +
                (postWidth + last_panel * per_inch) * direction +
                (postWidth + rest_panel * per_inch) * direction
            )
            break;
          case 'right':
            post_group.rect(delta_x(right_panel_count - 1), delta_y(right_panel_count - 1) - postWidth - last_panel * per_inch, postWidth, postWidth)
              .attr({stroke: bc_colors[2], fill: bc_colors[2], strokeWidth: 0})
            bc_dimension(
              pos,
              delta_x(right_panel_count - 1),
              delta_y(right_panel_count - 1),
              delta_x(right_panel_count - 1),
              delta_y(right_panel_count - 1) - postWidth - last_panel * per_inch
            )
            bc_dimension(
              pos,
              delta_x(right_panel_count - 1),
              delta_y(right_panel_count - 1) - postWidth - last_panel * per_inch,
              delta_x(right_panel_count - 1),
              delta_y(right_panel_count - 1) - 2 * postWidth - (last_panel + rest_panel) * per_inch
            )
            break;
          case 'bottom':
            post_group.rect(delta_x(right_panel_count - 1) + postWidth + last_panel * per_inch, delta_y(right_panel_count - 1), postWidth, postWidth)
              .attr({stroke: bc_colors[2], fill: bc_colors[2], strokeWidth: 0})
            bc_dimension(
              pos,
              delta_x(right_panel_count - 1),
              delta_y(right_panel_count - 1),
              delta_x(right_panel_count - 1) + postWidth + last_panel * per_inch,
              delta_y(right_panel_count - 1)
            )
            bc_dimension(
              pos,
              delta_x(right_panel_count - 1) + postWidth + last_panel * per_inch,
              delta_y(right_panel_count - 1),
              delta_x(right_panel_count - 1) + 2 * postWidth + (last_panel + rest_panel) * per_inch,
              delta_y(right_panel_count - 1)
            )
            break;
          default: break;
        }
      } else if(rest_right_length) {
        right_filler = (rest_right_length - postWidth) % per_inch;

        switch(pos) {
          case 'left':
            let direction = sideSurface?.door?.wide ? 1 : -1;
            bc_dimension(
              pos,
              delta_x(right_panel_count-1),
              delta_y(right_panel_count-1),
              delta_x(right_panel_count-1),
              delta_y(right_panel_count-1) + (rest_right_length - right_filler) * direction
            )
            break;
          case 'right':
            bc_dimension(
              pos,
              delta_x(right_panel_count-1),
              delta_y(right_panel_count-1),
              delta_x(right_panel_count-1),
              delta_y(right_panel_count-1) - rest_right_length + right_filler
            )
            break;
          case 'bottom':
            bc_dimension(
              pos,
              delta_x(right_panel_count-1),
              delta_y(right_panel_count-1),
              delta_x(right_panel_count-1) + rest_right_length - right_filler,
              delta_y(right_panel_count-1)
            )
            break;
          default: break;
        }
      }
      
      if(left_filler || right_filler) bc_filler(pos, left_filler || right_filler)
    }
  
    const createSVG = () => {
      let svg = document.querySelector('#snap-svg')
      svg.innerHTML = ''
      svg.setAttribute("viewBox", `0 0 ${svg_width + 2 * line_delta} ${svg_height}`)
    }

    const drawDoor = (s, x, y, pos, door) => {
      switch(door.style) {
        case 'Door':
          const is_opposite_direction = door.hand_option.includes('Hinge Right') ? false : true;
          bc_door(s, x, y, pos, door.wide, is_opposite_direction)
          break;
        case 'Double Door':
          if(pos === 'left' || pos === 'bottom')
            bc_door(s, x, y, pos, door.wide / 2, true)
          else bc_door(s, x, y, pos, door.wide / 2)

          if(pos === 'bottom')
            bc_door(s, x + door.wide / 2, y, pos, door.wide / 2)
          else if(pos === 'left') bc_door(s, x, y + door.wide / 2, pos, door.wide / 2)
          else if(pos === 'right') bc_door(s, x, y + door.wide / 2, pos, door.wide / 2, true)
          break;
        default: break;
      }

      // draw the dimension for the door
      switch(pos) {
        case 'left':
          bc_dimension(pos, x , y - postWidth, x, y + door.wide, door.style)
          break;
        case 'right':
          bc_dimension(pos, x + postWidth / 2 , y + door.wide, x + postWidth / 2, y - postWidth, door.style)
          break;
        case 'bottom':
          bc_dimension(pos, x - postWidth , y + postWidth / 2, x + door.wide, y + postWidth / 2, door.style)
          break;
        default: break;
      }
    }

    const bc_door = (s, x, y, pos, length, rotate = false) => {
      const delta = 0.1;
      let delta_width, delta_height;
      let width = pos === 'left' || pos === 'right' ? 3 + delta : length;
      let height = pos === 'top' || pos === 'bottom' ? 3 + delta : length;

      // set the width and the height of the door surface
      if(pos === 'left') {
        delta_width = - 1;
        delta_height = 0
      } else if(pos === 'right') {
        delta_width = 1;
        delta_height = 0
      } else {
        delta_width = 0;
        delta_height = 1
      }
      
      const door_svg =
        s.svg(x + delta_width, y + delta_height, width, height , delta_width, delta_height, width, height).g();

      if(rotate)
        door_svg.attr({
          style: `
            transform: translate${pos === 'left' || pos === 'right' ? 'X' : 'Y'}(${- delta}px) rotate(180deg);
            transform-origin: center;
          `
        });

      if(pos === 'left') {
        door_svg.rect(1, length - 0.6, 1, 0.5)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.rect(2, length / 4, 1, 1)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.rect(0, length / 4, 1, 1)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.rect(1, 0, 1, length - 0.8)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.line(1, length - 1.8, 2, length - 1.8,)
        .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
      } else if(pos === 'right') {
        door_svg.rect(1, 0, 1, 0.6)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.rect(2, length * 3 / 4, 1, 1)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.rect(0, length * 3 / 4, 1, 1)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.rect(1, 0.8, 1, length - 0.8)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.line(1, 1.8, 2, 1.8)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
      } else if(pos === 'bottom') {
        door_svg.rect(length / 4, 2, 1, 1)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.rect(length / 4, 0, 1, 1)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.rect(length - 0.6, 1, 0.5, 1)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.rect(0, 1, length - 0.8, 1)
        .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.line(length - 1.8, 1, length - 1.8, 2)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
      } else if(pos === 'top') {
        door_svg.rect(0.8, 1, width - 0.8, height)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.rect(width * 3 / 4 , 2, 1, 1)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.line(1.8, 1, 1.8, 2)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
        door_svg.rect(0, 1, 0.6, 1)
          .attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#ddd'});
      }
    }

    const bc_filler = (pos, length) => {
      const door_pos = surfaceData[toUpper(pos)]?.door?.pos;
      const filler_svg_w = () => {
        let w;
        switch(pos) {
          case 'bottom':
            w = length; break;
          default:
            w = side_depth; break;
        }
        return w;
      }
      const filler_svg_h = () => {
        let h;
        switch(pos) {
          case 'bottom':
            h = side_depth; break;
          default:
            h = length; break;
        }
        return h;
      }
      const filler_x = () => {
        let x;
        switch(pos) {
          case 'left':
            x = 1; break;
          case 'right':
            x = surfaceData.Bottom.width - postWidth; break;
          case 'bottom':
            if(door_pos === 'Center' || door_pos === 'Right Of Center' || door_pos === 'Far Right')
              x = postWidth + 1;
            else x = surfaceData.Bottom.width - length - 1;
            break;
          default: break;
        }
        return x;
      }
      const filler_y = () => {
        let y;
        switch(pos) {
          case 'left':
            if(door_pos !== 'Far Left')
              y = postWidth;
            else y = surfaceData.Left.width - length - postWidth;
            break;
          case 'right':
            if(door_pos === 'Far Right')
              y = surfaceData.Right.width - length - postWidth;
            else y = postWidth;
            break;
          case 'bottom':
            y = surfaceData.Left.width - postWidth - 1; break;
          default: break;
        }
        return y;
      }

      let side = s.select('#' + pos).svg(filler_x(), filler_y(), filler_svg_w(), filler_svg_h(), 0, 0, filler_svg_w(), filler_svg_h())

      if(pos === 'bottom')
        side.rect(0, 1, length, 1).attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#495057'});
      else side.rect(1, 0, 1, length).attr({stroke: bc_colors[1], strokeWidth: 0.1, fill: '#495057'});

      bc_filler_dimension(pos, filler_x(), filler_y(), length)
    }

    const bc_dimension = (pos, x1, y1, x2, y2, text) => {
      const line_delta = 0.1
      const back_wall_x = 30;
      const back_wall_y = 7;
      const delta_x =
        back_wall_x +
        (pos === 'bottom' ? postWidth : 0) -
        (pos === 'left' ? dimension_depth : 0) +
        (pos === 'right' ? strokeWidth : 0);
      const delta_y = back_wall_y + postWidth;
      const dimension_length =
        Math.abs(pos === 'bottom' ? x1 - x2 : y1 - y2) - postWidth;
      const dimension_x = () => {
        return x1 < x2 ? x1 : x2;
      }
      const dimension_y = () => {
        return y1 < y2 ? y1 : y2;
      }
      const dimension_surface =
        dimension_group.svg(
          dimension_x() + delta_x,
          dimension_y() + delta_y,
          pos === 'bottom' ? dimension_length : dimension_depth,
          pos === 'bottom' ? dimension_depth : dimension_length,
          0,
          0,
          pos === 'bottom' ? dimension_length : dimension_depth,
          pos === 'bottom' ? dimension_depth : dimension_length,
        )

      if(pos === 'left') {
        dimension_surface.line(dimension_depth / 2, line_delta, dimension_depth, line_delta)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
        dimension_surface.line(dimension_depth / 2, dimension_length - line_delta, dimension_depth, dimension_length - line_delta)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
        dimension_surface.line(dimension_depth / 2, line_delta, dimension_depth / 2, line_delta + dimension_length / 3)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
        dimension_surface.line(dimension_depth / 2, dimension_length - line_delta, dimension_depth / 2, dimension_length - line_delta - dimension_length / 3)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
      } else if(pos === 'right') {
        dimension_surface.line(0, line_delta, dimension_depth / 2, line_delta)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
        dimension_surface.line(0, dimension_length - line_delta, dimension_depth / 2, dimension_length - line_delta)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
        dimension_surface.line(dimension_depth / 2, line_delta, dimension_depth / 2, line_delta + dimension_length / 3)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
        dimension_surface.line(dimension_depth / 2, dimension_length - line_delta, dimension_depth / 2, dimension_length - line_delta - dimension_length / 3)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
      } else {
        dimension_surface.line(line_delta, 0, line_delta, dimension_depth / 2)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
        dimension_surface.line(dimension_length - line_delta, 0, dimension_length - line_delta, dimension_depth / 2)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
        dimension_surface.line(line_delta, dimension_depth / 2, line_delta + dimension_length / 3, dimension_depth / 2,)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
        dimension_surface.line(dimension_length - line_delta, dimension_depth / 2, dimension_length - line_delta - dimension_length / 3, dimension_depth / 2,)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
      }

      let text_line = dimension_surface.text(
        "50%",
        "50%"
      ).attr({
        style: `font-size: 4px`,
        "dominant-baseline": "middle",
        "text-anchor": "middle",
      });

      text_line.append(Snap.parse(`<tspan x="50%" ${text ? 'dy="-0.6em"' : ''}>${dimension_length / per_inch}'</tspan>`))
      if(text) text_line.append(Snap.parse(`<tspan x="50%" dy="1.2em">${text}</tspan>`))
    }

    const bc_filler_dimension = (pos, x, y, length) => {
      const door = surfaceData[toUpper(pos)]?.door;
      const door_pos = door?.style ? door?.pos : '';
      const dimension_depth = 16;
      const dimension_length = 20;
      const back_wall_x = 30;
      const back_wall_y = 7;
      const delta_x =
        back_wall_x -
        (pos === 'right' ? dimension_depth - strokeWidth - 1 : 0) +
        (pos === 'left' ? postWidth : 0) -
        (pos === 'right' ? postWidth : 0) +
        (pos === 'bottom' ? length / 2 : 0) -
        (pos === 'bottom' && door_pos !== 'Far Right' ? dimension_length : 0);
      const delta_y =
        back_wall_y -
        (pos === 'bottom' ? dimension_depth - postWidth - 1 : 0) +
        (pos !== 'bottom' ? length / 2 : 0) -
        (
          (pos === 'left' && door_pos === 'Far Left') ||
            (pos === 'right' && door_pos === 'Far Right') ?
            dimension_length : 0
        ) - 
        (pos === 'bottom' ? postWidth : 0);
      const dimension_surface =
        dimension_group.svg(
          x + delta_x,
          y + delta_y,
          pos === 'bottom' ? dimension_length : dimension_depth,
          pos === 'bottom' ? dimension_depth : dimension_length,
          0,
          0,
          pos === 'bottom' ? dimension_length : dimension_depth,
          pos === 'bottom' ? dimension_depth : dimension_length,
        )

      const taper_length = 5;

      if(pos === 'left') {
        if(door_pos === 'Far Left')
          dimension_surface.line(0, dimension_length, taper_length, dimension_length - taper_length)
            .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
        else dimension_surface.line(0, 0, taper_length, taper_length)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })

        dimension_surface.line(taper_length, taper_length, taper_length, dimension_length - taper_length)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
      } else if(pos === 'right') {
        if(door_pos === 'Far Right')
          dimension_surface.line(dimension_depth, dimension_length, dimension_depth - taper_length, dimension_length - taper_length)
            .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
        else dimension_surface.line(dimension_depth, 0, dimension_depth - taper_length, taper_length)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
          
        dimension_surface.line(dimension_depth - taper_length, taper_length, dimension_depth - taper_length, dimension_length - taper_length)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
      } else if(pos === 'bottom') {
        if(door_pos === 'Far Right')
          dimension_surface.line(0, dimension_depth, taper_length, dimension_depth - taper_length)
            .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
        else dimension_surface.line(dimension_length, dimension_depth, dimension_length - taper_length, dimension_depth - taper_length)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
          
        dimension_surface.line(taper_length, dimension_depth - taper_length, dimension_length - taper_length, dimension_depth - taper_length)
          .attr({ stroke: bc_colors[1], strokeWidth: 0.1 })
      }

      dimension_surface.text("50%", "50%", length + '"').attr({
        style: `font-size: 4px`,
        "dominant-baseline": "middle",
        "text-anchor": "middle",
      });
    }

    const toUpper = (text) => {
      return text.charAt(0).toUpperCase() + text.slice(1);
    }

    createSVG();
    drawSurface();
  }, [surfaceData])

  const openModal = (title) => {
    selectTheWall(title)
	}

  return (
    <div className="position-relative each-wall">
      <div><svg id="snap-svg" /></div>
      <div className="wall-editions">
        <div className="left-edition">
          <div className="option-content">
            <div className="title">Wall 1</div>
          </div>
          <button className="btn" onClick={() => {openModal('Wall 1')}}>configure</button>
        </div>
        <div className="bottom-edition">
          <div className="option-content">
            <div className="title">Wall 2</div>
          </div>
          <button className="btn" onClick={() => {openModal('Wall 2')}}>configure</button>
        </div>
        <div className="right-edition">
          <div className="option-content">
            <div className="title">Wall 3</div>
          </div>
          <button className="btn" onClick={() => {openModal('Wall 3')}}>configure</button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
	surfaceData: state.surface,
});

const mapDispatchToProps = (dispatch) => ({
  selectTheWall: (title) => {
    dispatch({
      type: 'SELECT_WALL',
      title: title
    })
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EachWall);