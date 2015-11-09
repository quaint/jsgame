	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 30);
		};
	})();

	var linearSpeed = 0.2;
	var angle = 0;
	var baseAngleVar = 10;
	var baseAngle = 20;
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var tree;
	var levels, extraSegs, segHeight, segHeightFactor, segWidthFactor;
	
	var m_canvas = document.createElement('canvas');
	m_canvas.width = 640;
	m_canvas.height = 480;
	var m_context = m_canvas.getContext("2d");
	
	function animate(lastTime, tree) {
		
		// update
		var date = new Date();
		var time = date.getTime();
		var timeDiff = time - lastTime;
		var linearDistEachFrame = linearSpeed * timeDiff / 1000;
		
		tree.angle = baseAngle + Math.sin(angle) * baseAngleVar;
		angle += linearDistEachFrame;

		lastTime = time;

		// clear
		m_context.clearRect(0, 0, m_canvas.width, m_canvas.height);
		
		// draw
		m_context.save();
		m_context.translate(tree.x, tree.y);
		drawTree(m_context, tree);
		m_context.restore();
		
		// request new frame
		requestAnimFrame(function() {
		  animate(lastTime, tree);
		  context.clearRect(0, 0, canvas.width, canvas.height);
		  context.drawImage(m_canvas, 0, 0);
		});
	}

	function drawTree(context, tree, level) {
		if (level == null) {
			level = 0;
		  }
		if(level >= tree.levels) {
			return;
		}
		var branches = level * tree.extraSegments + 1;
		var degrees = (branches - 1) * tree.angle / 2;
		context.lineWidth = (tree.levels - level) * tree.segmentWidthFactor;
		context.strokeStyle = 'rgb(' +  (125 - (level) * 25) + ', 80, 25)';
		for(var branch = 0; branch < branches; branch++) {
			context.save();

			context.rotate((branch * tree.angle - degrees) * (Math.PI / 180.0));
       		
       		context.beginPath();
       		context.moveTo(0, 0);
       		context.lineTo(0, -tree.segmentHeight);
       		context.stroke();

       		context.translate(0, -tree.segmentHeight*0.94);
			context.scale(tree.segmentHeightFactor, tree.segmentHeightFactor);
       		
       		drawTree(context, tree, level + 1);
       		
       		context.restore();
		}
	}

	window.onload = function() {

		tree = {
			x: 320,
			y: 470,
			segmentHeight: 160,
			levels: 5,
			angle: 20,
			segmentHeightFactor: 0.7,
			segmentWidthFactor: 2,
			minAngle: 20,
			maxAngle: 30,
			extraSegments: 2
		};
	
		var date = new Date();
		var time = date.getTime();
		animate(time, tree);
	};