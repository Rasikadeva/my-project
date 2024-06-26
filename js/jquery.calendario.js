! function(n, s) {
    "use strict";
    n.Calendario = function(t, e) {
        this.$el = n(e), this._init(t)
    }, n.Calendario.defaults = {
        weeks: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        weekabbrs: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthabbrs: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        displayWeekAbbr: !1,
        displayMonthAbbr: !1,
        startIn: 1,
        events: "click",
        fillEmpty: !0,
        feedParser: "./feed/",
        zone: "00:00",
        format: "MM-DD-YYYY",
        checkUpdate: !1
    }, n.Calendario.prototype = {
        _init: function(t) {
            this.VERSION = "3.2.0", this.UNIQUE = "%{unique}%", this.options = n.extend(!0, {}, n.Calendario.defaults, t), this.today = new Date, this.month = isNaN(this.options.month) || null === this.options.month ? this.today.getMonth() : this.options.month - 1, this.year = isNaN(this.options.year) || null === this.options.year ? this.today.getFullYear() : this.options.year, this.caldata = this._processCaldata(this.options.caldata), 1.9 <= parseFloat(n().jquery) && -1 != this.options.events.indexOf("hover") && this.logError("'hover' psuedo-name is not supported in jQuery 1.9+. Use 'mouseenter' 'mouseleave' events instead."), this.options.events = this.options.events.split(","), this.options.zone = "+" != this.options.zone.charAt(0) && "-" != this.options.zone.charAt(0) ? "+" + this.options.zone : this.options.zone, this._generateTemplate(!0), this._initEvents()
        },
        _processCaldataObj: function(t, e) {
            var a;
            return (t = "object" != typeof t ? {
                content: t,
                startTime: "00:00",
                endTime: "23:59",
                allDay: !0
            } : t).content || this.logError("Content is missing in date " + e), t.startTime && !t.endTime && (t.endTime = parseInt(t.startTime.split(":")[0]) + 1 + ":" + t.startTime.split(":")[1]), (t = !t.startTime && !t.endTime ? n.extend({}, t, {
                startTime: "00:00",
                endTime: "23:59",
                allDay: !0
            }) : t).startTime && t.endTime && t.allDay === s && (t.allDay = !1), (/^\d{2}-DD-\d{4}/.test(e) || /^\d{2}-DD-YYYY/.test(e)) && (3 == (e = /^(\d{2})-DD-(\d{4})/.exec(e) || /^(\d{2})-DD-YYYY/.exec(e)).length ? a = new Date(e[2], e[1], 0) : 2 == e.length && (a = new Date(this.year, e[1], 0)), t.startDate || (t.startDate = 1), t.endDate || 1 == a.getDate() || (t.endDate = a.getDate()), t.endDate || 1 != a.getDate() || 3 != e.length || (t.endDate = a.getDate())), t
        },
        _processCaldata: function(t) {
            var s = this;
            return t = t || {}, n.each(t, function(a, i) {
                /^\d{2}-\d{2}-\d{4}/.test(a) || /^\d{2}-\d{2}-YYYY/.test(a) || /^\d{2}-DD-YYYY/.test(a) || /^MM-\d{2}-YYYY/.test(a) || /^\d{2}-DD-YYYY/.test(a) || /^MM-\d{2}-\d{4}/.test(a) || /^\d{2}-DD-\d{4}/.test(a) || "TODAY" == a || s.logError(a + " is an Invalid Date. Date should not contain spaces, should be separated by '-' and should be in the format 'MM-DD-YYYY'. That ain't that difficult!"), Array.isArray(i) ? (n.each(i, function(t, e) {
                    i[t] = s._processCaldataObj(e, a)
                }), t[a] = i) : t[a] = s._processCaldataObj(i, a)
            }), t
        },
        _propDate: function(t, e) {
            var a = t.index(),
                i = {
                    allDay: [],
                    content: [],
                    endTime: [],
                    startTime: []
                },
                a = {
                    day: t.children("span.fc-date").text(),
                    month: this.month + 1,
                    monthname: (this.options.displayMonthAbbr ? this.options.monthabbrs : this.options.months)[this.month],
                    year: this.year,
                    weekday: a + this.options.startIn,
                    weekdayname: this.options.weeks[6 == a ? 0 : a + this.options.startIn]
                };
            t.children("div.fc-calendar-events").children("div.fc-calendar-event").each(function(t, e) {
                e = n("<div>" + n(e).html() + "</div>");
                i.startTime[t] = new Date(e.find("time.fc-starttime").attr("datetime")), i.endTime[t] = new Date(e.find("time.fc-endtime").attr("datetime")), i.allDay[t] = "true" === e.find("time.fc-allday").attr("datetime"), e.find("time").remove(), i.content[t] = e.html()
            }), a.day && this.options[e](t, i, a)
        },
        _initEvents: function() {
            for (var a = this, e = [], i = [], t = 0; t < a.options.events.length; t++) e[t] = a.options.events[t].toLowerCase().trim(), i[t] = "onDay" + e[t].charAt(0).toUpperCase() + e[t].slice(1), this.options[i[t]] === s && (this.options[i[t]] = function(t, e, a) {
                return !1
            }), this.$el.on(e[t] + ".calendario", "div.fc-row > div", function(t) {
                "mouseenter" != t.type && "mouseleave" != t.type || (t.type = -1 == n.inArray(t.type, e) ? "hover" : t.type), a._propDate(n(this), i[n.inArray(t.type, e)])
            });
            this.$el.on("shown.calendar.calendario", function(t, e) {
                e && e.options.checkUpdate && a._checkUpdate()
            }), this.$el.delay(new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 1, 0, 0, 0) - (new Date).getTime()).queue(function() {
                a.today = new Date, a.today.getMonth() != a.month && a.today.getMonth() + 1 != a.month || a._generateTemplate(!0), a.$el.trigger(n.Event("newday.calendar.calendario"))
            })
        },
        _checkUpdate: function() {
            var a = this;
            n.getScript("js/cal-update.js").done(function(t, e) {
                calendario.current != a.version() && parseFloat(calendario.current) >= parseFloat(a.version()) && console.info(calendario.msg)
            }).fail(function(t, e, a) {
                console.error(a)
            })
        },
        _generateTemplate: function(t, e) {
            var a, i = this._getHead(),
                s = this._getBody();
            switch (this.rowTotal) {
                case 4:
                    a = "fc-four-rows";
                    break;
                case 5:
                    a = "fc-five-rows";
                    break;
                case 6:
                    a = "fc-six-rows"
            }
            this.$cal = n('<div class="fc-calendar ' + a + '">').append(i, s), this.$el.find("div.fc-calendar").remove().end().append(this.$cal), this.$el.find(".fc-emptydate").parent().css({
                background: "transparent",
                cursor: "default"
            }), t || this.$el.trigger(n.Event("shown.calendario")), e && e.call()
        },
        _getHead: function() {
            for (var t = '<div class="fc-head">', e = 0; e <= 6; e++) {
                var a = e + this.options.startIn,
                    a = 6 < a ? a - 6 - 1 : a;
                t += "<div>" + (this.options.displayWeekAbbr ? this.options.weekabbrs : this.options.weeks)[a] + "</div>"
            }
            return t + "</div>"
        },
        _parseDataToDay: function(t, e, a) {
            var i = "";
            if (a) {
                Array.isArray(t) || (t = [t]);
                for (var s = 0; s < t.length; s++) 1 != this.month && e >= t[s].startDate && e <= t[s].endDate ? i += this._wrapDay(t[s], e, !0) : 1 == this.month && e >= t[s].startDate && (!(t[s].endDate && e <= t[s].endDate) && t[s].endDate || (i += this._wrapDay(t[s], e, !0)))
            } else i = Array.isArray(t) ? this._convertDayArray(t, e) : this._wrapDay(t, e, !0);
            return i
        },
        _toDateTime: function(t, e, a) {
            var i = parseInt(this.options.zone.split(":")[0]),
                s = parseInt(this.options.zone.charAt(0) + this.options.zone.split(":")[1]),
                n = parseInt(t.split(":")[0]) - i,
                o = parseInt(t.split(":")[1]) - s,
                t = new Date(Date.UTC(this.year, this.month, e, n, o, 0, 0));
            return a && (i = parseInt(a.split(":")[0]) - i, s = parseInt(a.split(":")[1]) - s, t.getTime() - new Date(Date.UTC(this.year, this.month, e, i, s, 0, 0)).getTime() < 0 && (t = new Date(Date.UTC(this.year, this.month, e + 1, n, o, 0, 0)))), t.toISOString()
        },
        _timeHtml: function(t, e) {
            var a = t.content;
            return a += '<time class="fc-allday" datetime="' + t.allDay + '"></time>', a += '<time class="fc-starttime" datetime="' + this._toDateTime(t.startTime, e) + '">' + t.startTime + "</time>", a += '<time class="fc-endtime" datetime="' + this._toDateTime(t.endTime, e, t.startTime) + '">' + t.endTime + "</time>"
        },
        _wrapDay: function(t, e, a) {
            return e ? a ? '<div class="fc-calendar-event">' + this._timeHtml(t, e) + "</div>" : this._timeHtml(t, e) : '<div class="fc-calendar-event">' + t + "</div>"
        },
        _convertDayArray: function(t, e) {
            for (var a = [], i = 0; i < t.length; i++) a[i] = this._wrapDay(t[i], e, !1);
            return this._wrapDay(a.join('</div><div class="fc-calendar-event">'))
        },
        _getBody: function() {
            var t = new Date(this.year, this.month + 1, 0),
                e = t.getDate(),
                t = new Date(this.year, t.getMonth(), 1),
                a = new Date(this.year, this.month, 0).getDate();
            this.startingDay = t.getDay();
            for (var i = '<div class="fc-body"><div class="fc-row">', s = 1, n = 0; n < 7; n++) {
                for (var o = 0; o <= 6; o++) {
                    var r, h, d, c, l = this.startingDay - this.options.startIn,
                        p = l < 0 ? 6 + l + 1 : l,
                        y = "",
                        m = this.month === this.today.getMonth() && this.year === this.today.getFullYear() && s === this.today.getDate(),
                        u = this.year < this.today.getFullYear() || this.month < this.today.getMonth() && this.year === this.today.getFullYear() || this.month === this.today.getMonth() && this.year === this.today.getFullYear() && s < this.today.getDate(),
                        f = "";
                    this.options.fillEmpty && (o < p || 0 < n) && (e < s ? (y = '<span class="fc-date fc-emptydate">' + (s - e) + '</span><span class="fc-weekday">', ++s) : 1 == s && (y = '<span class="fc-date fc-emptydate">' + (a - p + 1) + '</span><span class="fc-weekday">', ++a), y += this.options.weekabbrs[6 < o + this.options.startIn ? o + this.options.startIn - 6 - 1 : o + this.options.startIn] + "</span>"), s <= e && (0 < n || p <= o) ? (y = '<span class="fc-date">' + s + '</span><span class="fc-weekday">' + this.options.weekabbrs[6 < o + this.options.startIn ? o + this.options.startIn - 6 - 1 : o + this.options.startIn] + "</span>", d = (this.month + 1 < 10 ? "0" + (this.month + 1) : this.month + 1) + "-" + (s < 10 ? "0" + s : s) + "-" + this.year, r = this.caldata[d], c = (this.month + 1 < 10 ? "0" + (this.month + 1) : this.month + 1) + "-" + (s < 10 ? "0" + s : s) + "-YYYY", h = this.caldata[c], l = "MM-" + (s < 10 ? "0" + s : s) + "-" + this.year, p = this.caldata[l], d = this.caldata["MM-" + (s < 10 ? "0" + s : s) + "-YYYY"], c = (this.month + 1 < 10 ? "0" + (this.month + 1) : this.month + 1) + "-DD-" + this.year, l = this.caldata[c], c = (this.month + 1 < 10 ? "0" + (this.month + 1) : this.month + 1) + "-DD-YYYY", c = this.caldata[c], m && this.caldata.TODAY && (f += this._parseDataToDay(this.caldata.TODAY, s)), r && (f += this._parseDataToDay(r, s)), p && (f += this._parseDataToDay(p, s)), l && (f += this._parseDataToDay(l, s, !0)), c && (f += this._parseDataToDay(c, s, !0)), d && (f += this._parseDataToDay(d, s)), h && (f += this._parseDataToDay(h, s)), "" !== f && (y += '<div class="fc-calendar-events">' + f + "</div>"), ++s) : m = !1;
                    m = m ? "fc-today " : "";
                    m += u ? "fc-past " : "fc-future ", "" !== f && (m += "fc-content"), i += ("" !== m ? '<div class="' + m.trim() + '">' : "<div>") + y + "</div>"
                }
                if (e < s) {
                    this.rowTotal = n + 1;
                    break
                }
                i += '</div><div class="fc-row">'
            }
            return i + "</div></div>"
        },
        _move: function(t, e, a) {
            "previous" === e ? "month" === t ? (this.year = 0 < this.month ? this.year : --this.year, this.month = 0 < this.month ? --this.month : 11) : "year" === t && (this.year = --this.year) : "next" === e && ("month" === t ? (this.year = this.month < 11 ? this.year : ++this.year, this.month = this.month < 11 ? ++this.month : 0) : "year" === t && (this.year = ++this.year)), this._generateTemplate(!1, a)
        },
        option: function(t, e) {
            if (!e) return this.options[t];
            this.options[t] = e
        },
        getYear: function() {
            return this.year
        },
        getMonth: function() {
            return this.month + 1
        },
        getMonthName: function() {
            return (this.options.displayMonthAbbr ? this.options.monthabbrs : this.options.months)[this.month]
        },
        getCell: function(t) {
            var e = Math.floor((t + this.startingDay - this.options.startIn - 1) / 7),
                t = t + this.startingDay - this.options.startIn - 7 * e - 1;
            return this.$cal.find("div.fc-body").children("div.fc-row").eq(e).children("div").eq(t)
        },
        setData: function(t, e) {
            t = this._processCaldata(t), e ? this.caldata = t : n.extend(this.caldata, t), this._generateTemplate(!1)
        },
        gotoNow: function(t) {
            this.month = this.today.getMonth(), this.year = this.today.getFullYear(), this._generateTemplate(!1, t)
        },
        gotoMonth: function(t, e, a) {
            this.month = t - 1, this.year = e, this._generateTemplate(!1, a)
        },
        gotoPreviousMonth: function(t) {
            this._move("month", "previous", t)
        },
        gotoPreviousYear: function(t) {
            this._move("year", "previous", t)
        },
        gotoNextMonth: function(t) {
            this._move("month", "next", t)
        },
        gotoNextYear: function(t) {
            this._move("year", "next", t)
        },
        feed: function(e) {
            n.post(this.options.feedParser, {
                dates: this.caldata
            }).always(function(t) {
                e && e.call(this, JSON.parse(t).hevent)
            })
        },
        version: function() {
            return this.VERSION
        }
    };

    function i(t) {
        throw new Error(t)
    }
    n.fn.calendario = function(t) {
        var e, a = n.data(this, "calendario");
        return "string" == typeof t ? (e = Array.prototype.slice.call(arguments, 1), this.each(function() {
            a ? (n.isFunction(a[t]) && "_" !== t.charAt(0) || i("No such method '" + t + "' for calendario instance."), a[t].apply(a, e)) : i("Cannot call methods on calendario prior to initialization; Attempted to call method '" + t + "'")
        })) : this.each(function() {
            a ? a._init() : a = n.data(this, "calendario", new n.Calendario(t, this))
        }), a.$el.trigger(n.Event("shown.calendar.calendario"), [a]), a
    }
}(jQuery, void window);