import * as t from 'babel-types';

var awaitVisitor = {
	ArrowFunctionExpression: function ArrowFunctionExpression (path) {
		if (!path.node.async) {
			path.arrowFunctionToShadowed();
		}
	},
	Identifier: function Identifier (_ref) {
		if (_ref.node.name === 'ctx') {
			_ref.node.loc.identifierName = 'this';
			_ref.node.name = 'this';
		}
	},
	AwaitExpression: function AwaitExpression (_ref) {
		var node = _ref.node;
		if (node.argument.type === 'CallExpression' && node.argument.callee.name === 'next') {
			node.argument.name = node.argument.callee.name;
			node.argument.type = 'Identifier';
			delete node.argument.callee;
		}
		node.type = 'YieldExpression';
	},
	ReturnStatement: function finder (path) {
		try {
			if (path.node.argument.callee.object.callee.name === 'next' && path.node.argument.callee.property.name === 'then') {
				path.insertAfter(path.node.argument.arguments[0].body.body);
				path.replaceWith(t.yieldExpression(t.identifier('next'), false));
			}
		} catch (e) {
			// console.log(JSON.stringify(path.node, 5, 5));
		}
	},
	FunctionExpression: function FunctionDeclaration (path) {
		path.node.generator = path.node.async;
		path.node.async = false;
	}
};

function plainFunction (path, callId) {
	var node = path.node;
	var isKoa2 = node.async && node.params.length > 0 && node.params[0].name === 'ctx';
	if (path.isArrowFunctionExpression() && node.params.length > 0 && node.params[0].name === 'ctx' && node.params[1].name === 'next') {
		path.arrowFunctionToShadowed();
		node = path.node;
		node.async = false;
		node.generator = true;
		isKoa2 = true;
	}
	path.traverse(awaitVisitor);
	if (path.isArrowFunctionExpression()) {
		path.arrowFunctionToShadowed();
	}
	node.generator = true;
	node.async = false;
	if (isKoa2) {
		delete node.params[0];
	}
}

export default function (path, callId) {
	return plainFunction(path.node, callId);
}
